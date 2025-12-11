import type { IncomeSource } from "@/types";
import { createServer } from "../../server";

// Income Source Management Functions
export const fetchIncomeSourcesServer = async (): Promise<IncomeSource[]> => {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("income_source")
    .select("*")
    .eq("active", true)
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
};
