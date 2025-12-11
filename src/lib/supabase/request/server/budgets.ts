import type { BudgetWithCurrent } from "@/types";
import { createServer } from "../../server";

export async function fetchBudgetsServer(
  page: number = 1,
  pageSize: number = 10
): Promise<BudgetWithCurrent[]> {
  const supabase = createServer();
  const { data, error } = await (
    await supabase
  )
    .from("budgets_with_current")
    .select("*")
    .range((page - 1) * pageSize, page * pageSize - 1)
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
