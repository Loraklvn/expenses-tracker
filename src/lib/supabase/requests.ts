// lib/supabase/requests.ts
import { Budget, Expense } from "@/types";
import { createClient } from "./client";

/** Client-side: fetch budgets (you can wrap this in React-Query if you like) */
export type BudgetWithCurrent = Budget & { current_amount: number };
export async function fetchBudgetsClient(): Promise<BudgetWithCurrent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("budgets_with_current")
    .select("*");
  if (error) throw error;
  return data || [];
}

export const fetchBudgetClient = async (
  budgetId: number
): Promise<BudgetWithCurrent | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("budgets_with_current")
    .select("*")
    .eq("id", budgetId)
    .single();
  if (error) throw error;
  return data || null;
};

export type ExpenseWithCurrent = Expense & { current_amount: number };
export async function fetchExpensesClient(
  budgetId: number
): Promise<ExpenseWithCurrent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("expenses_with_current")
    .select("*")
    .eq("budget_id", budgetId);

  if (error) throw error;
  return data || [];
}

export async function addTransactionClient(
  expenseId: number,
  amount: number,
  description?: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("transaction").insert([
    {
      expense_id: expenseId,
      amount,
      description,
    },
  ]);
  if (error) throw error;
}
