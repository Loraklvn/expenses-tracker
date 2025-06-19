import {
  BudgetWithCurrent,
  ExpenseTemplate,
  ExpenseWithCurrent,
} from "@/types";
import { createServer } from "../server";

export async function fetchBudgetsServer(): Promise<BudgetWithCurrent[]> {
  const supabase = createServer();
  const { data, error } = await (await supabase)
    .from("budgets_with_current")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export const fetchBudgetServer = async (
  budgetId: number
): Promise<BudgetWithCurrent | null> => {
  const supabase = createServer();
  const { data, error } = await (await supabase)
    .from("budgets_with_current")
    .select("*")
    .eq("id", budgetId)
    .single();
  if (error) throw error;
  return data || null;
};

export async function fetchExpensesServer(
  budgetId: number
): Promise<ExpenseWithCurrent[]> {
  const supabase = createServer();
  const { data, error } = await (await supabase)
    .from("expenses_with_current")
    .select("*")
    .eq("budget_id", budgetId);

  if (error) throw error;
  return data || [];
}

export async function addTransactionServer(
  expenseId: number,
  amount: number,
  description?: string
): Promise<void> {
  const supabase = await createServer();
  const { error } = await supabase.from("transaction").insert([
    {
      expense_id: expenseId,
      amount,
      description,
    },
  ]);
  if (error) throw error;
}

export const fetchExpensesTemplateServer = async (): Promise<
  ExpenseTemplate[]
> => {
  const supabase = await createServer();
  const { data, error } = await supabase.from("expense_template").select("*");
  if (error) throw error;
  return data || [];
};
