import type { ExpenseTemplate } from "@/types";
import { getSupabaseClient } from "../../client";

export const fetchExpensesTemplateClient = async (): Promise<
  ExpenseTemplate[]
> => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("expense_template")
    .select("*")
    .eq("archived", false) // filter out archived templates
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
};

export type PostExpenseTemplateArgs = {
  name: string;
  category_id: number;
  default_amount: number;
};
export const postExpenseTemplateClient = async (
  args: PostExpenseTemplateArgs
): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("expense_template").insert([
    {
      ...args,
    },
  ]);
  if (error) throw error;
};

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
  if (error) throw error;
};

export const archiveExpenseTemplateClient = async (
  templateId: number
): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("expense_template")
    .update({ archived: true })
    .eq("id", templateId);
  if (error) throw error;
};
