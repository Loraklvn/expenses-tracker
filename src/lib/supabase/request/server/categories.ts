import type { Category } from "@/types";
import { createServer } from "../../server";

export const fetchCategoriesServer = async (
  type: "income" | "expense" | "all" = "all"
): Promise<Category[]> => {
  const supabase = await createServer();
  const query = supabase
    .from("category")
    .select("*")
    .eq("archived", false)
    .order("name", { ascending: true });

  if (type !== "all") {
    query.eq("type", type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};
