import type { ExpenseTemplate, ExpenseWithCurrent } from "@/types";
import { getSupabaseClient } from "../../client";

export async function fetchExpensesClient(
  budgetId: number
): Promise<ExpenseWithCurrent[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("expenses_with_current")
    .select("*")
    .eq("budget_id", budgetId);

  if (error) throw error;
  return data || [];
}

type AddExpenseToBudgetArgs = {
  expenseTemplate: ExpenseTemplate;
  budgetId: number;
};

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
  if (error) throw error;
};

type AddCustomExpenseToBudgetArgs = {
  name: string;
  categoryId: number;
  amount: number;
  budgetId: number;
};

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
  if (error) throw error;
};

type UpdateBudgetExpenseArgs = {
  expenseId: number;
  name?: string;
  description?: string;
  amount: number;
};

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
  if (error) throw error;
};

export const deleteBudgetExpenseClient = async (
  expenseId: number
): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("budget_expense")
    .delete()
    .eq("id", expenseId);
  if (error) throw error;
};
