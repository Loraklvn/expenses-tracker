-- Income Sources Schema Implementation

-- 1. Create income_source table
CREATE TABLE income_source (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES category(id),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add income_source_id to transaction table
ALTER TABLE transaction 
ADD COLUMN income_source_id INTEGER REFERENCES income_source(id);

-- 3. Add constraints to ensure proper transaction types
ALTER TABLE transaction
DROP CONSTRAINT IF EXISTS valid_transaction_reference;

ALTER TABLE transaction
ADD CONSTRAINT valid_transaction_reference CHECK (
  -- Budgeted expense
  (type = 'expense' AND expense_id IS NOT NULL AND template_id IS NULL AND category_id IS NULL AND income_source_id IS NULL)
  OR
  -- Unbudgeted expense with template
  (type = 'expense' AND expense_id IS NULL AND template_id IS NOT NULL AND category_id IS NULL AND income_source_id IS NULL)
  OR
  -- Unbudgeted expense with category only
  (type = 'expense' AND expense_id IS NULL AND template_id IS NULL AND category_id IS NOT NULL AND income_source_id IS NULL)
  OR
  -- Income transaction
  (type = 'income' AND expense_id IS NULL AND template_id IS NULL AND category_id IS NULL AND income_source_id IS NOT NULL)
);

-- 4. Create indexes for performance
CREATE INDEX idx_income_source_user_id ON income_source(user_id);
CREATE INDEX idx_income_source_category_id ON income_source(category_id);
CREATE INDEX idx_transaction_income_source_id ON transaction(income_source_id);
CREATE INDEX idx_transaction_type_income_source ON transaction(type, income_source_id);

-- 5. Create updated view for transactions with income source details
CREATE OR REPLACE VIEW transactions_with_details AS
SELECT 
  t.id,
  t.description,
  t.amount,
  t.type,
  t.transaction_date,
  t.created_at,
  t.expense_id,
  t.template_id,
  t.category_id,
  t.income_source_id,
  
  -- Expense details (handle null names from templates)
  COALESCE(be.name, et.name) as expense_name,
  be.budgeted_amount as expense_budgeted_amount,
  b.name as budget_name,
  b.id as budget_id,
  
  -- Category details
  c.name as category_name,
  c.color as category_color,
  c.type as category_type,
  
  -- Income source details
  ins.name as income_source_name,
  ins.description as income_source_description,
  
  -- User info
  COALESCE(b.user_id, c.user_id, ins.user_id) as user_id
FROM transaction t
LEFT JOIN budget_expense be ON t.expense_id = be.id
LEFT JOIN budget b ON be.budget_id = b.id
LEFT JOIN expense_template et ON be.template_id = et.id
LEFT JOIN category c ON t.category_id = c.id
LEFT JOIN income_source ins ON t.income_source_id = ins.id;

-- 6. Create RLS policies for income_source table
ALTER TABLE income_source ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own income sources" ON income_source
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own income sources" ON income_source
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own income sources" ON income_source
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own income sources" ON income_source
  FOR DELETE USING (auth.uid() = user_id);

-- 7. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_income_source_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_income_source_updated_at
  BEFORE UPDATE ON income_source
  FOR EACH ROW
  EXECUTE FUNCTION update_income_source_updated_at(); 