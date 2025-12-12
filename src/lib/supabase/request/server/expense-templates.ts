import type { ExpenseTemplate } from "@/types";
import { createServer } from "../../server";
import { handleSupabaseError } from "../utils/error-handler";

/**
 * Fetches all active (non-archived) expense templates (server-side)
 *
 * @returns Promise resolving to an array of expense templates, sorted by name
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const templates = await fetchExpensesTemplateServer();
 * ```
 */
export const fetchExpensesTemplateServer = async (): Promise<
  ExpenseTemplate[]
> => {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("expense_template")
    .select("*")
    .eq("archived", false)
    .order("name", { ascending: true });
  if (error) handleSupabaseError(error, "fetching expense templates");
  return data || [];
};
