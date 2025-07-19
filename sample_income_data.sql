-- Sample Income Data Insertion
-- First, let's create some income categories (if they don't exist)

-- Insert income categories
INSERT INTO category (name, description, color, type, user_id, archived, created_at, updated_at)
VALUES 
  ('Salary', 'Regular employment income', '#10b981', 'income', auth.uid(), false, NOW(), NOW()),
  ('Freelance', 'Freelance and contract work', '#3b82f6', 'income', auth.uid(), false, NOW(), NOW()),
  ('Investment', 'Dividends, interest, capital gains', '#8b5cf6', 'income', auth.uid(), false, NOW(), NOW()),
  ('Business', 'Business and entrepreneurial income', '#f59e0b', 'income', auth.uid(), false, NOW(), NOW()),
  ('Other', 'Miscellaneous income sources', '#6b7280', 'income', auth.uid(), false, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Now insert income sources linked to these categories
-- Note: Replace auth.uid() with your actual user_id if running this manually

INSERT INTO income_source (name, description, category_id, user_id, active, created_at, updated_at)
SELECT 
  'Primary Job - Tech Company',
  'Full-time software development position',
  c.id,
  auth.uid(),
  true,
  NOW(),
  NOW()
FROM category c 
WHERE c.name = 'Salary' AND c.type = 'income' AND c.user_id = auth.uid()
ON CONFLICT DO NOTHING;

INSERT INTO income_source (name, description, category_id, user_id, active, created_at, updated_at)
SELECT 
  'Side Freelance Projects',
  'Part-time freelance development work',
  c.id,
  auth.uid(),
  true,
  NOW(),
  NOW()
FROM category c 
WHERE c.name = 'Freelance' AND c.type = 'income' AND c.user_id = auth.uid()
ON CONFLICT DO NOTHING;

INSERT INTO income_source (name, description, category_id, user_id, active, created_at, updated_at)
SELECT 
  'Stock Portfolio Dividends',
  'Quarterly dividends from stock investments',
  c.id,
  auth.uid(),
  true,
  NOW(),
  NOW()
FROM category c 
WHERE c.name = 'Investment' AND c.type = 'income' AND c.user_id = auth.uid()
ON CONFLICT DO NOTHING;

INSERT INTO income_source (name, description, category_id, user_id, active, created_at, updated_at)
SELECT 
  'Online Course Sales',
  'Income from selling online programming courses',
  c.id,
  auth.uid(),
  true,
  NOW(),
  NOW()
FROM category c 
WHERE c.name = 'Business' AND c.type = 'income' AND c.user_id = auth.uid()
ON CONFLICT DO NOTHING;

INSERT INTO income_source (name, description, category_id, user_id, active, created_at, updated_at)
SELECT 
  'Consulting Services',
  'Professional consulting and advisory services',
  c.id,
  auth.uid(),
  true,
  NOW(),
  NOW()
FROM category c 
WHERE c.name = 'Business' AND c.type = 'income' AND c.user_id = auth.uid()
ON CONFLICT DO NOTHING;

INSERT INTO income_source (name, description, category_id, user_id, active, created_at, updated_at)
SELECT 
  'Rental Income',
  'Income from rental properties',
  c.id,
  auth.uid(),
  true,
  NOW(),
  NOW()
FROM category c 
WHERE c.name = 'Other' AND c.type = 'income' AND c.user_id = auth.uid()
ON CONFLICT DO NOTHING;

-- Alternative: If you want to insert with specific user_id (replace 'your-user-id-here' with actual UUID)
-- Uncomment and modify the queries below if you need to specify a user_id manually

/*
INSERT INTO income_source (name, description, category_id, user_id, active, created_at, updated_at)
SELECT 
  'Primary Job - Tech Company',
  'Full-time software development position',
  c.id,
  'your-user-id-here'::uuid,
  true,
  NOW(),
  NOW()
FROM category c 
WHERE c.name = 'Salary' AND c.type = 'income' AND c.user_id = 'your-user-id-here'::uuid;
*/ 