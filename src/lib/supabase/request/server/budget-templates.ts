import type { BudgetTemplateWithStats } from "@/types";
import { createServer } from "../../server";

export const fetchBudgetTemplatesServer = async (): Promise<
  BudgetTemplateWithStats[]
> => {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("budget_templates_with_stats")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
};

export const fetchBudgetTemplateServer = async (
  templateId: number
): Promise<BudgetTemplateWithStats | null> => {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("budget_templates_with_stats")
    .select("*")
    .eq("id", templateId)
    .single();
  if (error) return null;
  return data || null;
};
