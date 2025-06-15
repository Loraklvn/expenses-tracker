export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "expense" | "income";
  transaction_date: string;
  expense_id: number;
}

export type ExpenseTemplate = {
  id: string;
  name: string;
  description: string;
  user_id: string;
  category_id: number;
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
}
