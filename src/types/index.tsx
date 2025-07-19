export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "expense" | "income";
  transaction_date: string;
  expense_id: number | null;
  template_id: number | null;
  category_id: number | null;
  income_source_id: number | null;
}

export type TransactionWithDetails = Transaction & {
  expense_name: string | null;
  budget_name: string | null;
  user_id: string;
  category_name: string | null;
  category_color: string | null;
  category_type: "income" | "expense" | null;
  income_source_name: string | null;
  income_source_description: string | null;
};

export type ExpenseTemplate = {
  id: number;
  name: string;
  description: string;
  user_id: string;
  category_id: number;
  default_amount: number;
  archived: boolean;
  created_at: string;
  updated_at: string;
};

export interface Expense {
  id: number;
  name: string;
  description: string;
  budgeted_amount: number;
  fixed: boolean;
  category_id: number;
  budget_id: number;
}

export type BudgetWithCurrent = Budget & { current_amount: number };

export type ExpenseWithCurrent = Expense & {
  current_amount: number;
  template_id: number;
};

export type PreloadedExpenseTemplate = ExpenseTemplate & {
  selected: boolean;
  amount: number | string; // Allow string for input compatibility
};

export type CustomExpense = {
  id: string;
  name: string;
  amount: string;
  category: string;
};

export interface Budget {
  id: number;
  name: string;
  expected_amount: number;
  start_date: string;
  end_date: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  created_at: string;
  updated_at: string;
  archived: boolean;
  type: "income" | "expense";
}

export type BudgetTemplate = {
  id: number;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type BudgetTemplateWithStats = BudgetTemplate & {
  expense_count: number;
  total_default_amount: number;
  expense_template_ids: number[];
};

export interface IncomeSource {
  id: number;
  name: string;
  description: string | null;
  category_id: number;
  user_id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}
