import type { ExpenseTemplate, ExpenseWithCurrent } from "@/types";
import { createServer } from "../../server";

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

export const fetchExpensesTemplateServer = async (): Promise<
  ExpenseTemplate[]
> => {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("expense_template")
    .select("*")
    .eq("archived", false)
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
};
