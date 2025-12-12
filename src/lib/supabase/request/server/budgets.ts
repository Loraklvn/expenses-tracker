import type { BudgetWithCurrent } from "@/types";
import { createServer } from "../../server";
import { handleSupabaseError } from "../utils/error-handler";

/**
 * Fetches a paginated list of budgets (server-side)
 *
 * @param page - Page number (default: 1)
 * @param pageSize - Number of items per page (default: 10)
 * @returns Promise resolving to an array of budgets, sorted by creation date (newest first)
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const budgets = await fetchBudgetsServer(1, 20);
 * ```
 */
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
  if (error) handleSupabaseError(error, "fetching budgets");
  return data || [];
}

/**
 * Fetches a single budget by ID (server-side)
 *
 * @param budgetId - The ID of the budget to fetch
 * @returns Promise resolving to the budget or null if not found
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const budget = await fetchBudgetServer(123);
 * ```
 */
export const fetchBudgetServer = async (
  budgetId: number
): Promise<BudgetWithCurrent | null> => {
  const supabase = createServer();
  const { data, error } = await (await supabase)
    .from("budgets_with_current")
    .select("*")
    .eq("id", budgetId)
    .single();
  if (error) handleSupabaseError(error, `fetching budget ${budgetId}`);
  return data || null;
};
