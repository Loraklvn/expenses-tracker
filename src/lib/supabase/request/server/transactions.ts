import type { TransactionWithDetails } from "@/types";
import { createServer } from "../../server";
import { handleSupabaseError } from "../utils/error-handler";

/**
 * Fetches a paginated list of transactions with optional filtering and search (server-side)
 *
 * @param page - Page number (default: 1)
 * @param pageSize - Number of items per page (default: 10)
 * @param searchTerm - Optional search term to filter transactions by name, description, or budget
 * @param type - Filter by transaction type: "income" or "expense" (default: "expense")
 * @returns Promise resolving to paginated transactions with total count
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const result = await fetchTransactionsServer(1, 20, "grocery", "expense");
 * ```
 */
export const fetchTransactionsServer = async (
  page: number = 1,
  pageSize: number = 10,
  searchTerm?: string,
  type: "income" | "expense" = "expense"
): Promise<{ transactions: TransactionWithDetails[]; total: number }> => {
  const supabase = await createServer();

  let query = supabase
    .from("transactions_with_details")
    .select("*", { count: "exact" })
    .eq("type", type) // filter by type
    .order("transaction_date", { ascending: false });

  if (searchTerm) {
    query = query.or(
      `expense_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,budget_name.ilike.%${searchTerm}%`
    );
  }

  const { data, error, count } = await query.range(
    (page - 1) * pageSize,
    page * pageSize - 1
  );

  if (error) handleSupabaseError(error, "fetching transactions");

  return {
    transactions: data || [],
    total: count || 0,
  };
};
