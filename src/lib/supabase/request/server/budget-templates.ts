import type { BudgetTemplateWithStats } from "@/types";
import { createServer } from "../../server";
import { handleSupabaseError } from "../utils/error-handler";

/**
 * Fetches all budget templates with statistics (server-side)
 *
 * @returns Promise resolving to an array of budget templates with stats, sorted by name
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const templates = await fetchBudgetTemplatesServer();
 * ```
 */
export const fetchBudgetTemplatesServer = async (): Promise<
  BudgetTemplateWithStats[]
> => {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("budget_templates_with_stats")
    .select("*")
    .order("name", { ascending: true });
  if (error) handleSupabaseError(error, "fetching budget templates");
  return data || [];
};

/**
 * Fetches a single budget template by ID (server-side)
 *
 * @param templateId - The ID of the template to fetch
 * @returns Promise resolving to the budget template or null if not found
 * @throws {SupabaseRequestError} If the database query fails (except when not found)
 *
 * @example
 * ```typescript
 * const template = await fetchBudgetTemplateServer(10);
 * ```
 */
export const fetchBudgetTemplateServer = async (
  templateId: number
): Promise<BudgetTemplateWithStats | null> => {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("budget_templates_with_stats")
    .select("*")
    .eq("id", templateId)
    .single();
  if (error) {
    // Return null for "not found" errors, throw for other errors
    if (error.code === "PGRST116") {
      return null;
    }
    handleSupabaseError(error, `fetching budget template ${templateId}`);
  }
  return data || null;
};
