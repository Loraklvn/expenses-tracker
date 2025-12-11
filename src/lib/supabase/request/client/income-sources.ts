import type { IncomeSource } from "@/types";
import { getSupabaseClient } from "../../client";

// Income Source Management Functions
export const fetchIncomeSourcesClient = async (): Promise<IncomeSource[]> => {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("income_source")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
};

type IncomeSourcePayload = {
  name: string;
  description?: string;
  category_id: number;
};

export const createIncomeSourceClient = async (
  args: IncomeSourcePayload
): Promise<void> => {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("income_source").insert([
    {
      ...args,
    },
  ]);
  if (error) throw error;
};

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
  if (error) throw error;
};

export const archiveIncomeSourceClient = async (
  incomeSourceId: number
): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("income_source")
    .update({ active: false })
    .eq("id", incomeSourceId);
  if (error) throw error;
};
