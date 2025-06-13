// lib/supabase/requests.ts
import { Budget, Expense } from "@/types";
import { createClient } from "./client";

/** Client-side: fetch budgets (you can wrap this in React-Query if you like) */
export async function fetchBudgetsClient(): Promise<Budget[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("budget").select("*");
  if (error) throw error;
  return data || [];
}

export async function fetchExpensesClient(
  budgetId: number
): Promise<Expense[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("expense")
    .select("*")
    .eq("budget_id", budgetId);

  if (error) throw error;
  return data || [];
}
