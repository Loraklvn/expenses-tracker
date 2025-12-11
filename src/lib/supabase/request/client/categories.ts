import type { Category } from "@/types";
import { getSupabaseClient } from "../../client";

type FetchCategoriesArgs = {
  archived?: boolean;
  type?: "income" | "expense" | "all";
};

export const fetchCategoriesClient = async ({
  archived = false,
  type = "expense",
}: FetchCategoriesArgs = {}): Promise<Category[]> => {
  const supabase = getSupabaseClient();
  const query = supabase
    .from("category")
    .select("*")
    .eq("archived", archived ?? false)
    .order("name", { ascending: true });

  if (type !== "all") {
    query.eq("type", type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

type CategoryPayload = {
  name: string;
  description?: string;
  color: string;
  type?: "income" | "expense";
};
export const createCategoryClient = async ({
  name,
  description,
  color,
  type = "expense",
}: CategoryPayload): Promise<void> => {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("category").insert([
    {
      name,
      description,
      color,
      type,
    },
  ]);
  if (error) throw error;
};

export const updateCategoryClient = async ({
  categoryId,
  updates,
}: {
  categoryId: number;
  updates: Partial<CategoryPayload>;
}): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("category")
    .update(updates)
    .eq("id", categoryId);
  if (error) throw error;
};

export const archiveCategoryClient = async (
  categoryId: number
): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("category")
    .update({ archived: true })
    .eq("id", categoryId);
  if (error) throw error;
};
