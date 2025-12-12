import type { IncomeSource } from "@/types";
import { createServer } from "../../server";
import { handleSupabaseError } from "../utils/error-handler";

/**
 * Fetches all active income sources (server-side)
 *
 * @returns Promise resolving to an array of active income sources, sorted by name
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const incomeSources = await fetchIncomeSourcesServer();
 * ```
 */
export const fetchIncomeSourcesServer = async (): Promise<IncomeSource[]> => {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("income_source")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });
  if (error) handleSupabaseError(error, "fetching income sources");
  return data || [];
};
