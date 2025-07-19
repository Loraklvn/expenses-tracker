-- Fix RLS Policies for Transaction Table to Handle Income Transactions

-- First, let's check if RLS is enabled on the transaction table
ALTER TABLE transaction ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (we'll recreate them)
DROP POLICY IF EXISTS "Users can view their own transactions" ON transaction;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transaction;
DROP POLICY IF EXISTS "Users can update their own transactions" ON transaction;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON transaction;

-- Create comprehensive RLS policies that handle both expense and income transactions

-- 1. SELECT policy - Users can view their own transactions
CREATE POLICY "Users can view their own transactions" ON transaction
  FOR SELECT USING (
    -- For budgeted expenses (linked to budget_expense -> budget -> user)
    (type = 'expense' AND expense_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM budget_expense be 
      JOIN budget b ON be.budget_id = b.id 
      WHERE be.id = transaction.expense_id AND b.user_id = auth.uid()
    ))
    OR
    -- For unbudgeted expenses with template (linked to expense_template -> user)
    (type = 'expense' AND template_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM expense_template et 
      WHERE et.id = transaction.template_id AND et.user_id = auth.uid()
    ))
    OR
    -- For unbudgeted expenses with category (linked to category -> user)
    (type = 'expense' AND category_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM category c 
      WHERE c.id = transaction.category_id AND c.user_id = auth.uid()
    ))
    OR
    -- For income transactions (linked to income_source -> user)
    (type = 'income' AND income_source_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM income_source ins 
      WHERE ins.id = transaction.income_source_id AND ins.user_id = auth.uid()
    ))
  );

-- 2. INSERT policy - Users can insert their own transactions
CREATE POLICY "Users can insert their own transactions" ON transaction
  FOR INSERT WITH CHECK (
    -- For budgeted expenses
    (type = 'expense' AND expense_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM budget_expense be 
      JOIN budget b ON be.budget_id = b.id 
      WHERE be.id = transaction.expense_id AND b.user_id = auth.uid()
    ))
    OR
    -- For unbudgeted expenses with template
    (type = 'expense' AND template_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM expense_template et 
      WHERE et.id = transaction.template_id AND et.user_id = auth.uid()
    ))
    OR
    -- For unbudgeted expenses with category
    (type = 'expense' AND category_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM category c 
      WHERE c.id = transaction.category_id AND c.user_id = auth.uid()
    ))
    OR
    -- For income transactions
    (type = 'income' AND income_source_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM income_source ins 
      WHERE ins.id = transaction.income_source_id AND ins.user_id = auth.uid()
    ))
  );

-- 3. UPDATE policy - Users can update their own transactions
CREATE POLICY "Users can update their own transactions" ON transaction
  FOR UPDATE USING (
    -- For budgeted expenses
    (type = 'expense' AND expense_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM budget_expense be 
      JOIN budget b ON be.budget_id = b.id 
      WHERE be.id = transaction.expense_id AND b.user_id = auth.uid()
    ))
    OR
    -- For unbudgeted expenses with template
    (type = 'expense' AND template_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM expense_template et 
      WHERE et.id = transaction.template_id AND et.user_id = auth.uid()
    ))
    OR
    -- For unbudgeted expenses with category
    (type = 'expense' AND category_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM category c 
      WHERE c.id = transaction.category_id AND c.user_id = auth.uid()
    ))
    OR
    -- For income transactions
    (type = 'income' AND income_source_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM income_source ins 
      WHERE ins.id = transaction.income_source_id AND ins.user_id = auth.uid()
    ))
  );

-- 4. DELETE policy - Users can delete their own transactions
CREATE POLICY "Users can delete their own transactions" ON transaction
  FOR DELETE USING (
    -- For budgeted expenses
    (type = 'expense' AND expense_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM budget_expense be 
      JOIN budget b ON be.budget_id = b.id 
      WHERE be.id = transaction.expense_id AND b.user_id = auth.uid()
    ))
    OR
    -- For unbudgeted expenses with template
    (type = 'expense' AND template_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM expense_template et 
      WHERE et.id = transaction.template_id AND et.user_id = auth.uid()
    ))
    OR
    -- For unbudgeted expenses with category
    (type = 'expense' AND category_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM category c 
      WHERE c.id = transaction.category_id AND c.user_id = auth.uid()
    ))
    OR
    -- For income transactions
    (type = 'income' AND income_source_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM income_source ins 
      WHERE ins.id = transaction.income_source_id AND ins.user_id = auth.uid()
    ))
  );

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'transaction'; 