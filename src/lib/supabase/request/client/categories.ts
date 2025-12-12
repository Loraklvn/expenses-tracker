import type { Category } from "@/types";
import { getSupabaseClient } from "../../client";
import { handleSupabaseError } from "../utils/error-handler";

type FetchCategoriesArgs = {
  archived?: boolean;
  type?: "income" | "expense" | "all";
};

/**
 * Fetches categories with optional filtering
 *
 * @param args - Query parameters for fetching categories
 * @param args.archived - Whether to include archived categories (default: false)
 * @param args.type - Filter by category type: "income", "expense", or "all" (default: "expense")
 * @returns Promise resolving to an array of categories, sorted by name
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const categories = await fetchCategoriesClient({ type: "all", archived: false });
 * ```
 */
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
  if (error) handleSupabaseError(error, "fetching categories");
  return data || [];
};

type CategoryPayload = {
  name: string;
  description?: string;
  color: string;
  type?: "income" | "expense";
};

/**
 * Creates a new category
 *
 * @param args - Category creation parameters
 * @param args.name - Name of the category
 * @param args.description - Optional description
 * @param args.color - Color code for the category (e.g., "#FF5733")
 * @param args.type - Type of category: "income" or "expense" (default: "expense")
 * @returns Promise that resolves when the category is created
 * @throws {SupabaseRequestError} If the database insert fails
 *
 * @example
 * ```typescript
 * await createCategoryClient({
 *   name: "Food & Dining",
 *   description: "Restaurant and grocery expenses",
 *   color: "#FF5733",
 *   type: "expense"
 * });
 * ```
 */
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
  if (error) handleSupabaseError(error, `creating category "${name}"`);
};

/**
 * Updates an existing category
 *
 * @param args - Update parameters
 * @param args.categoryId - The ID of the category to update
 * @param args.updates - Partial category data to update
 * @returns Promise that resolves when the category is updated
 * @throws {SupabaseRequestError} If the database update fails
 *
 * @example
 * ```typescript
 * await updateCategoryClient({
 *   categoryId: 3,
 *   updates: { name: "Updated Name", color: "#00FF00" }
 * });
 * ```
 */
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
  if (error) handleSupabaseError(error, `updating category ${categoryId}`);
};

/**
 * Archives a category (soft delete)
 *
 * @param categoryId - The ID of the category to archive
 * @returns Promise that resolves when the category is archived
 * @throws {SupabaseRequestError} If the database update fails
 *
 * @example
 * ```typescript
 * await archiveCategoryClient(3);
 * ```
 */
export const archiveCategoryClient = async (
  categoryId: number
): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("category")
    .update({ archived: true })
    .eq("id", categoryId);
  if (error) handleSupabaseError(error, `archiving category ${categoryId}`);
};
