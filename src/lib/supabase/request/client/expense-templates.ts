import type { ExpenseTemplate } from "@/types";
import { getSupabaseClient } from "../../client";
import { handleSupabaseError } from "../utils/error-handler";

/**
 * Fetches all active (non-archived) expense templates
 *
 * @returns Promise resolving to an array of expense templates, sorted by name
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const templates = await fetchExpensesTemplateClient();
 * ```
 */
export const fetchExpensesTemplateClient = async (): Promise<
  ExpenseTemplate[]
> => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("expense_template")
    .select("*")
    .eq("archived", false) // filter out archived templates
    .order("name", { ascending: true });
  if (error) handleSupabaseError(error, "fetching expense templates");
  return data || [];
};

export type PostExpenseTemplateArgs = {
  name: string;
  category_id: number;
  default_amount: number;
};

/**
 * Creates a new expense template
 *
 * @param args - Expense template creation parameters
 * @param args.name - Name of the expense template
 * @param args.category_id - ID of the category for this template
 * @param args.default_amount - Default budgeted amount for this template
 * @returns Promise that resolves when the template is created
 * @throws {SupabaseRequestError} If the database insert fails
 *
 * @example
 * ```typescript
 * await postExpenseTemplateClient({
 *   name: "Rent",
 *   category_id: 1,
 *   default_amount: 1200
 * });
 * ```
 */
export const postExpenseTemplateClient = async (
  args: PostExpenseTemplateArgs
): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("expense_template").insert([
    {
      ...args,
    },
  ]);
  if (error)
    handleSupabaseError(error, `creating expense template "${args.name}"`);
};

/**
 * Updates an existing expense template
 *
 * @param args - Update parameters
 * @param args.templateId - The ID of the template to update
 * @param args.args - Partial expense template data to update
 * @returns Promise that resolves when the template is updated
 * @throws {SupabaseRequestError} If the database update fails
 *
 * @example
 * ```typescript
 * await updateExpenseTemplateClient({
 *   templateId: 5,
 *   args: { name: "Updated Name", default_amount: 1500 }
 * });
 * ```
 */
export const updateExpenseTemplateClient = async ({
  templateId,
  args,
}: {
  templateId: number;
  args: Partial<PostExpenseTemplateArgs>;
}): Promise<void> => {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("expense_template")
    .update(args)
    .eq("id", templateId);
  if (error)
    handleSupabaseError(error, `updating expense template ${templateId}`);
};

/**
 * Archives an expense template (soft delete)
 *
 * @param templateId - The ID of the template to archive
 * @returns Promise that resolves when the template is archived
 * @throws {SupabaseRequestError} If the database update fails
 *
 * @example
 * ```typescript
 * await archiveExpenseTemplateClient(5);
 * ```
 */
export const archiveExpenseTemplateClient = async (
  templateId: number
): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("expense_template")
    .update({ archived: true })
    .eq("id", templateId);
  if (error)
    handleSupabaseError(error, `archiving expense template ${templateId}`);
};
