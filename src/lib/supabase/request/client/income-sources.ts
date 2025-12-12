import type { IncomeSource } from "@/types";
import { getSupabaseClient } from "../../client";
import { handleSupabaseError } from "../utils/error-handler";

/**
 * Fetches all active income sources
 *
 * @returns Promise resolving to an array of active income sources, sorted by name
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const incomeSources = await fetchIncomeSourcesClient();
 * ```
 */
export const fetchIncomeSourcesClient = async (): Promise<IncomeSource[]> => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("income_source")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });
  if (error) handleSupabaseError(error, "fetching income sources");
  return data || [];
};

type IncomeSourcePayload = {
  name: string;
  description?: string;
  category_id: number;
};

/**
 * Creates a new income source
 *
 * @param args - Income source creation parameters
 * @param args.name - Name of the income source
 * @param args.description - Optional description
 * @param args.category_id - ID of the category for this income source
 * @returns Promise that resolves when the income source is created
 * @throws {SupabaseRequestError} If the database insert fails
 *
 * @example
 * ```typescript
 * await createIncomeSourceClient({
 *   name: "Full-time Job",
 *   description: "Primary employment",
 *   category_id: 1
 * });
 * ```
 */
export const createIncomeSourceClient = async (
  args: IncomeSourcePayload
): Promise<void> => {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("income_source").insert([
    {
      ...args,
    },
  ]);
  if (error)
    handleSupabaseError(error, `creating income source "${args.name}"`);
};

/**
 * Updates an existing income source
 *
 * @param args - Update parameters
 * @param args.incomeSourceId - The ID of the income source to update
 * @param args.updates - Partial income source data to update
 * @returns Promise that resolves when the income source is updated
 * @throws {SupabaseRequestError} If the database update fails
 *
 * @example
 * ```typescript
 * await updateIncomeSourceClient({
 *   incomeSourceId: 5,
 *   updates: { name: "Updated Name", description: "New description" }
 * });
 * ```
 */
export const updateIncomeSourceClient = async ({
  incomeSourceId,
  updates,
}: {
  incomeSourceId: number;
  updates: Partial<IncomeSourcePayload>;
}): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("income_source")
    .update(updates)
    .eq("id", incomeSourceId);
  if (error)
    handleSupabaseError(error, `updating income source ${incomeSourceId}`);
};

/**
 * Archives an income source by setting active to false (soft delete)
 *
 * @param incomeSourceId - The ID of the income source to archive
 * @returns Promise that resolves when the income source is archived
 * @throws {SupabaseRequestError} If the database update fails
 *
 * @example
 * ```typescript
 * await archiveIncomeSourceClient(5);
 * ```
 */
export const archiveIncomeSourceClient = async (
  incomeSourceId: number
): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("income_source")
    .update({ active: false })
    .eq("id", incomeSourceId);
  if (error)
    handleSupabaseError(error, `archiving income source ${incomeSourceId}`);
};
