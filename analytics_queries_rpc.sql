-- Analytics RPC Functions for Efficient Querying
-- These functions query the transaction table directly for optimal performance
-- Recommended indexes (create if they don't exist):
CREATE INDEX IF NOT EXISTS idx_transaction_type_date_income_source ON transaction(type, transaction_date, income_source_id) WHERE type = 'income';
CREATE INDEX IF NOT EXISTS idx_transaction_type_date_expense_id ON transaction(type, transaction_date, expense_id) WHERE type = 'expense';
CREATE INDEX IF NOT EXISTS idx_transaction_type_date_category ON transaction(type, transaction_date, category_id) WHERE type = 'expense';
CREATE INDEX IF NOT EXISTS idx_transaction_type_date_template ON transaction(type, transaction_date, template_id) WHERE type = 'expense';

-- Item 2: Income by Source
-- Returns aggregated income data grouped by income source with source name included
CREATE OR REPLACE FUNCTION get_income_by_source(
  _start_date DATE DEFAULT NULL,
  _end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  income_source_id INTEGER,
  income_source_name VARCHAR(255),
  total NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.income_source_id,
    ins.name::VARCHAR(255) as income_source_name,
    SUM(t.amount) as total
  FROM transaction t
  INNER JOIN income_source ins ON t.income_source_id = ins.id
  WHERE 
    t.type = 'income'
    AND (_start_date IS NULL OR t.transaction_date >= _start_date)
    AND (_end_date IS NULL OR t.transaction_date <= _end_date)
    AND t.income_source_id IS NOT NULL
    AND ins.user_id = auth.uid()  -- RLS equivalent
  GROUP BY t.income_source_id, ins.name
  ORDER BY total DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Item 3: Income by Category
-- Returns aggregated income data grouped by category
-- Note: For income transactions, category comes from income_source.category_id, not transaction.category_id
CREATE OR REPLACE FUNCTION get_income_by_category(
  _start_date DATE DEFAULT NULL,
  _end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  primary_category_id INTEGER,
  total NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ins.category_id as primary_category_id,
    SUM(t.amount) as total
  FROM transaction t
  INNER JOIN income_source ins ON t.income_source_id = ins.id
  WHERE 
    t.type = 'income'
    AND (_start_date IS NULL OR t.transaction_date >= _start_date)
    AND (_end_date IS NULL OR t.transaction_date <= _end_date)
    AND t.income_source_id IS NOT NULL
    AND ins.category_id IS NOT NULL
    AND ins.user_id = auth.uid()  -- RLS equivalent
  GROUP BY ins.category_id
  ORDER BY total DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Item 4: Spending by Category
-- Returns aggregated expense data grouped by category
-- Handles three scenarios:
-- 1. Budgeted expenses: category from budget_expense.category_id
-- 2. Unbudgeted with template: category from expense_template.category_id
-- 3. Unbudgeted with category: category from transaction.category_id
CREATE OR REPLACE FUNCTION get_spending_by_category(
  _start_date DATE DEFAULT NULL,
  _end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  primary_category_id INTEGER,
  total NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(be.category_id, et.category_id, t.category_id) as primary_category_id,
    SUM(t.amount) as total
  FROM transaction t
  LEFT JOIN budget_expense be ON t.expense_id = be.id
  LEFT JOIN expense_template et ON t.template_id = et.id
  WHERE 
    t.type = 'expense'
    AND (_start_date IS NULL OR t.transaction_date >= _start_date)
    AND (_end_date IS NULL OR t.transaction_date <= _end_date)
    AND COALESCE(be.category_id, et.category_id, t.category_id) IS NOT NULL
    -- RLS equivalent checks
    AND (
      -- Budgeted expense: check budget user
      (t.expense_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM budget b WHERE b.id = be.budget_id AND b.user_id = auth.uid()
      ))
      OR
      -- Unbudgeted with template: check expense_template user
      (t.template_id IS NOT NULL AND et.id IS NOT NULL AND et.user_id = auth.uid())
      OR
      -- Unbudgeted with category: check category user
      (t.category_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM category c WHERE c.id = t.category_id AND c.user_id = auth.uid()
      ))
    )
  GROUP BY COALESCE(be.category_id, et.category_id, t.category_id)
  ORDER BY total DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Item 5: Spending by Template
-- Returns aggregated expense data grouped by template
-- Handles two scenarios:
-- 1. Budgeted expenses: template_id from budget_expense.template_id
-- 2. Unbudgeted expenses: template_id from transaction.template_id
CREATE OR REPLACE FUNCTION get_spending_by_template(
  _start_date DATE DEFAULT NULL,
  _end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  template_id INTEGER,
  total NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(be.template_id, t.template_id) as template_id,
    SUM(t.amount) as total
  FROM transaction t
  LEFT JOIN budget_expense be ON t.expense_id = be.id
  WHERE 
    t.type = 'expense'
    AND COALESCE(be.template_id, t.template_id) IS NOT NULL
    AND (_start_date IS NULL OR t.transaction_date >= _start_date)
    AND (_end_date IS NULL OR t.transaction_date <= _end_date)
    -- RLS equivalent checks
    AND (
      -- Budgeted expense: check budget user
      (t.expense_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM budget b WHERE b.id = be.budget_id AND b.user_id = auth.uid()
      ))
      OR
      -- Unbudgeted with template: check expense_template user
      (t.template_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM expense_template et WHERE et.id = t.template_id AND et.user_id = auth.uid()
      ))
    )
  GROUP BY COALESCE(be.template_id, t.template_id)
  ORDER BY total DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Item 6: Budget Performance
-- Returns the average completion percentage across all budgets
-- This calculates: average of (current_amount / expected_amount) * 100 for all budgets
CREATE OR REPLACE FUNCTION get_budget_performance(
  _start_date DATE DEFAULT NULL,
  _end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  average_completion_percentage NUMERIC,
  total_budgets INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH filtered_budgets AS (
    SELECT 
      bw.current_amount,
      bw.expected_amount
    FROM budgets_with_current bw
    WHERE 
      bw.user_id = auth.uid()
      AND (
        -- Filter by date range if provided
        -- Budget overlaps with the date range if:
        -- - Budget starts before or during the range, AND
        -- - Budget ends after or during the range
        (_start_date IS NULL AND _end_date IS NULL)
        OR
        (
          (_start_date IS NULL OR bw.end_date >= _start_date)
          AND (_end_date IS NULL OR bw.start_date <= _end_date)
        )
      )
  )
  SELECT 
    COALESCE(
      AVG(
        CASE 
          WHEN fb.expected_amount > 0 THEN (fb.current_amount / fb.expected_amount) * 100
          ELSE 0
        END
      ),
      0
    ) as average_completion_percentage,
    COUNT(*)::INTEGER as total_budgets
  FROM filtered_budgets fb;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

