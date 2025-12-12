import type { BudgetTemplateWithStats } from "@/types";
import { getSupabaseClient } from "../../client";
import { handleSupabaseError } from "../utils/error-handler";

export type CreateBudgetTemplateArgs = {
  name: string;
  description?: string;
  expenseTemplateIds: number[];
};

/**
 * Creates a new budget template with associated expense templates
 *
 * @param args - Budget template creation parameters
 * @param args.name - Name of the budget template
 * @param args.description - Optional description
 * @param args.expenseTemplateIds - Array of expense template IDs to include
 * @returns Promise resolving to the new budget template ID as a string
 * @throws {SupabaseRequestError} If the database operation fails
 *
 * @example
 * ```typescript
 * const templateId = await createBudgetTemplateClient({
 *   name: "Monthly Budget Template",
 *   description: "Standard monthly expenses",
 *   expenseTemplateIds: [1, 2, 3, 5]
 * });
 * ```
 */
export async function createBudgetTemplateClient({
  name,
  description,
  expenseTemplateIds,
}: CreateBudgetTemplateArgs): Promise<string> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("create_budget_template", {
    p_name: name,
    p_description: description ?? "",
    p_expense_ids: expenseTemplateIds,
  });

  if (error) handleSupabaseError(error, `creating budget template "${name}"`);
  // data is the returned UUID
  return data as string;
}

/**
 * Fetches all budget templates with statistics
 *
 * @returns Promise resolving to an array of budget templates with stats, sorted by name
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const templates = await fetchBudgetTemplatesClient();
 * ```
 */
export const fetchBudgetTemplatesClient = async (): Promise<
  BudgetTemplateWithStats[]
> => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("budget_templates_with_stats")
    .select("*")
    .order("name", { ascending: true });
  if (error) handleSupabaseError(error, "fetching budget templates");
  return data || [];
};

type UpdateBudgetTemplateArgs = {
  templateId: number;
  name: string;
  description: string;
  expenseTemplateIds: number[];
};

/**
 * Updates an existing budget template and its associated expense templates
 *
 * @param args - Update parameters
 * @param args.templateId - The ID of the template to update
 * @param args.name - New name for the template
 * @param args.description - New description
 * @param args.expenseTemplateIds - New array of expense template IDs
 * @returns Promise that resolves when the template is updated
 * @throws {SupabaseRequestError} If the database operation fails
 *
 * @example
 * ```typescript
 * await updateBudgetTemplateClient({
 *   templateId: 10,
 *   name: "Updated Template",
 *   description: "New description",
 *   expenseTemplateIds: [1, 2, 4, 6]
 * });
 * ```
 */
export async function updateBudgetTemplateClient({
  name,
  description,
  templateId,
  expenseTemplateIds,
}: UpdateBudgetTemplateArgs): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.rpc("update_budget_template", {
    p_template_id: templateId,
    p_name: name,
    p_description: description,
    p_expense_ids: expenseTemplateIds,
  });
  if (error)
    handleSupabaseError(error, `updating budget template ${templateId}`);
}

/**
 * Deletes a budget template by ID
 *
 * @param templateId - The ID of the template to delete
 * @returns Promise that resolves when the template is deleted
 * @throws {SupabaseRequestError} If the database delete fails
 *
 * @example
 * ```typescript
 * await deleteBudgetTemplateClient(10);
 * ```
 */
export async function deleteBudgetTemplateClient(
  templateId: number
): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("budget_template")
    .delete()
    .eq("id", templateId);
  if (error)
    handleSupabaseError(error, `deleting budget template ${templateId}`);
}
