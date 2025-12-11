import type { BudgetTemplateWithStats } from "@/types";
import { getSupabaseClient } from "../../client";

export type CreateBudgetTemplateArgs = {
  name: string;
  description?: string;
  expenseTemplateIds: number[];
};

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

  if (error) throw error;
  // data is the returned UUID
  return data as string;
}

export const fetchBudgetTemplatesClient = async (): Promise<
  BudgetTemplateWithStats[]
> => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("budget_templates_with_stats")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
};

type UpdateBudgetTemplateArgs = {
  templateId: number;
  name: string;
  description: string;
  expenseTemplateIds: number[];
};

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
  if (error) throw error;
}

export async function deleteBudgetTemplateClient(
  templateId: number
): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("budget_template")
    .delete()
    .eq("id", templateId);
  if (error) throw error;
}
