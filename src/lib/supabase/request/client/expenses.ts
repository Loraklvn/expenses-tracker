import type { ExpenseTemplate, ExpenseWithCurrent } from "@/types";
import { getSupabaseClient } from "../../client";
import { handleSupabaseError } from "../utils/error-handler";

/**
 * Fetches all expenses for a specific budget
 *
 * @param budgetId - The ID of the budget to fetch expenses for
 * @returns Promise resolving to an array of expenses with current spending data
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const expenses = await fetchExpensesClient(123);
 * ```
 */
export async function fetchExpensesClient(
  budgetId: number
): Promise<ExpenseWithCurrent[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("expenses_with_current")
    .select("*")
    .eq("budget_id", budgetId);

  if (error)
    handleSupabaseError(error, `fetching expenses for budget ${budgetId}`);
  return data || [];
}

type AddExpenseToBudgetArgs = {
  expenseTemplate: ExpenseTemplate;
  budgetId: number;
};

/**
 * Adds an expense template to a budget
 *
 * @param args - Object containing the expense template and budget ID
 * @param args.expenseTemplate - The expense template to add
 * @param args.budgetId - The ID of the budget to add the expense to
 * @returns Promise that resolves when the expense is added
 * @throws {SupabaseRequestError} If the database insert fails
 *
 * @example
 * ```typescript
 * await addExpenseToBudgetClient({
 *   expenseTemplate: { id: 1, name: "Rent", ... },
 *   budgetId: 123
 * });
 * ```
 */
export const addExpenseToBudgetClient = async ({
  expenseTemplate,
  budgetId,
}: AddExpenseToBudgetArgs): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("budget_expense").insert([
    {
      template_id: expenseTemplate.id,
      budget_id: budgetId,
      budgeted_amount: expenseTemplate.default_amount,
      category_id: expenseTemplate.category_id,
    },
  ]);
  if (error)
    handleSupabaseError(
      error,
      `adding expense template ${expenseTemplate.id} to budget ${budgetId}`
    );
};

type AddCustomExpenseToBudgetArgs = {
  name: string;
  categoryId: number;
  amount: number;
  budgetId: number;
};

/**
 * Adds a custom expense (not from a template) to a budget
 *
 * @param args - Object containing the custom expense details
 * @param args.name - The name of the custom expense
 * @param args.categoryId - The ID of the category for this expense
 * @param args.amount - The budgeted amount for this expense
 * @param args.budgetId - The ID of the budget to add the expense to
 * @returns Promise that resolves when the expense is added
 * @throws {SupabaseRequestError} If the database insert fails
 *
 * @example
 * ```typescript
 * await addCustomExpenseToBudgetClient({
 *   name: "Custom Expense",
 *   categoryId: 5,
 *   amount: 100,
 *   budgetId: 123
 * });
 * ```
 */
export const addCustomExpenseToBudgetClient = async ({
  name,
  categoryId,
  amount,
  budgetId,
}: AddCustomExpenseToBudgetArgs): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("budget_expense").insert([
    {
      name,
      category_id: categoryId,
      budget_id: budgetId,
      budgeted_amount: amount,
    },
  ]);
  if (error)
    handleSupabaseError(
      error,
      `adding custom expense "${name}" to budget ${budgetId}`
    );
};

type UpdateBudgetExpenseArgs = {
  expenseId: number;
  name?: string;
  description?: string;
  amount: number;
};

/**
 * Updates an existing budget expense
 *
 * @param args - Object containing the expense ID and fields to update
 * @param args.expenseId - The ID of the expense to update
 * @param args.name - Optional new name for the expense
 * @param args.description - Optional new description for the expense
 * @param args.amount - The new budgeted amount
 * @returns Promise that resolves when the expense is updated
 * @throws {SupabaseRequestError} If the database update fails
 *
 * @example
 * ```typescript
 * await updateBudgetExpenseClient({
 *   expenseId: 456,
 *   name: "Updated Name",
 *   amount: 200
 * });
 * ```
 */
export const updateBudgetExpenseClient = async ({
  expenseId,
  name,
  description,
  amount,
}: UpdateBudgetExpenseArgs): Promise<void> => {
  const updates: Record<string, unknown> = {
    budgeted_amount: amount,
  };
  if (name) updates.name = name;
  if (description) updates.description = description;

  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("budget_expense")
    .update(updates)
    .eq("id", expenseId);
  if (error) handleSupabaseError(error, `updating expense ${expenseId}`);
};

/**
 * Deletes a budget expense
 *
 * @param expenseId - The ID of the expense to delete
 * @returns Promise that resolves when the expense is deleted
 * @throws {SupabaseRequestError} If the database delete fails
 *
 * @example
 * ```typescript
 * await deleteBudgetExpenseClient(456);
 * ```
 */
export const deleteBudgetExpenseClient = async (
  expenseId: number
): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("budget_expense")
    .delete()
    .eq("id", expenseId);
  if (error) handleSupabaseError(error, `deleting expense ${expenseId}`);
};
