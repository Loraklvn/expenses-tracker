import type { Category } from "@/types";
import { createServer } from "../../server";
import { handleSupabaseError } from "../utils/error-handler";

/**
 * Fetches categories with optional filtering (server-side)
 *
 * @param type - Filter by category type: "income", "expense", or "all" (default: "all")
 * @returns Promise resolving to an array of non-archived categories, sorted by name
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const categories = await fetchCategoriesServer("expense");
 * ```
 */
export const fetchCategoriesServer = async (
  type: "income" | "expense" | "all" = "all"
): Promise<Category[]> => {
  const supabase = await createServer();
  const query = supabase
    .from("category")
    .select("*")
    .eq("archived", false)
    .order("name", { ascending: true });

  if (type !== "all") {
    query.eq("type", type);
  }

  const { data, error } = await query;
  if (error) handleSupabaseError(error, "fetching categories");
  return data || [];
};
