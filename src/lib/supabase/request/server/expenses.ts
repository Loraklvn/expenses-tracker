import type { ExpenseWithCurrent } from "@/types";
import { createServer } from "../../server";
import { handleSupabaseError } from "../utils/error-handler";

/**
 * Fetches all expenses for a specific budget (server-side)
 *
 * @param budgetId - The ID of the budget to fetch expenses for
 * @returns Promise resolving to an array of expenses with current spending data
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const expenses = await fetchExpensesServer(123);
 * ```
 */
export async function fetchExpensesServer(
  budgetId: number
): Promise<ExpenseWithCurrent[]> {
  const supabase = createServer();
  const { data, error } = await (await supabase)
    .from("expenses_with_current")
    .select("*")
    .eq("budget_id", budgetId);

  if (error)
    handleSupabaseError(error, `fetching expenses for budget ${budgetId}`);
  return data || [];
}
