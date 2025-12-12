import type {
  BudgetWithCurrent,
  CustomExpense,
  PreloadedExpenseTemplate,
} from "@/types";
import { getSupabaseClient } from "../../client";
import { handleSupabaseError } from "../utils/error-handler";

export type FetchBudgetsClientArgs = {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type FetchBudgetsClientResult = {
  budgets: BudgetWithCurrent[];
  total: number;
  page: number;
  pageSize: number;
};

/**
 * Fetches a paginated list of budgets with optional search and sorting
 *
 * @param args - Query parameters for fetching budgets
 * @param args.page - Page number (default: 1)
 * @param args.pageSize - Number of items per page (default: 10)
 * @param args.searchTerm - Optional search term to filter budgets by name
 * @param args.sortBy - Field to sort by (default: "created_at")
 * @param args.sortOrder - Sort order, "asc" or "desc" (default: "desc")
 * @returns Promise resolving to paginated budgets with total count
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const result = await fetchBudgetsClient({
 *   page: 1,
 *   pageSize: 20,
 *   searchTerm: "Monthly",
 *   sortBy: "name",
 *   sortOrder: "asc"
 * });
 * ```
 */
export async function fetchBudgetsClient({
  page = 1,
  pageSize = 10,
  searchTerm,
  sortBy = "created_at",
  sortOrder = "desc",
}: FetchBudgetsClientArgs = {}): Promise<FetchBudgetsClientResult> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from("budgets_with_current")
    .select("*", { count: "exact" });
  if (searchTerm) {
    query.filter("name", "ilike", `%${searchTerm}%`);
  }
  query = query.order(sortBy, { ascending: sortOrder === "asc" });
  // 2) Compute range
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query.range(from, to);
  if (error) handleSupabaseError(error, "fetching budgets");

  return {
    budgets: data || [],
    total: count || 0,
    page,
    pageSize,
  };
}

/**
 * Fetches a single budget by ID
 *
 * @param budgetId - The ID of the budget to fetch
 * @returns Promise resolving to the budget or null if not found
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const budget = await fetchBudgetClient(123);
 * ```
 */
export const fetchBudgetClient = async (
  budgetId: number
): Promise<BudgetWithCurrent | null> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("budgets_with_current")
    .select("*")
    .eq("id", budgetId)
    .single();
  if (error) handleSupabaseError(error, `fetching budget ${budgetId}`);
  return data || null;
};

export interface CreateBudgetArgs {
  name: string;
  expectedAmount: number;
  startDate: string;
  endDate: string;
  templates: PreloadedExpenseTemplate[]; // has { id, category_id, selected, amount }
  customs: CustomExpense[]; // has { name, amount, category }
}

/**
 * Creates a budget with all its expense lines (templated and custom) in a single transaction
 *
 * This function creates a new budget and automatically adds all selected expense templates
 * and custom expenses as budget expense lines. The operation is atomic - if any part fails,
 * the entire operation is rolled back.
 *
 * @param args - Budget creation parameters
 * @param args.name - Name of the budget
 * @param args.expectedAmount - Expected total income/amount for the budget
 * @param args.startDate - Start date of the budget (YYYY-MM-DD format)
 * @param args.endDate - End date of the budget (YYYY-MM-DD format)
 * @param args.templates - Array of expense templates to include (only selected ones are added)
 * @param args.customs - Array of custom expenses to add to the budget
 * @returns Promise resolving to the new budget ID as a string
 * @throws {SupabaseRequestError} If the database operation fails
 *
 * @example
 * ```typescript
 * const budgetId = await createBudgetWithLinesClient({
 *   name: "Monthly Budget",
 *   expectedAmount: 5000,
 *   startDate: "2024-01-01",
 *   endDate: "2024-01-31",
 *   templates: [{ id: 1, selected: true, ... }],
 *   customs: [{ name: "Custom", amount: "100", category: 5 }]
 * });
 * ```
 */
export async function createBudgetWithLinesClient({
  name,
  expectedAmount,
  startDate,
  endDate,
  templates,
  customs,
}: CreateBudgetArgs): Promise<string> {
  const supabase = getSupabaseClient();

  // build your payload as JS objects:
  const linesPayload = [
    // templated…
    ...templates
      .filter((t) => t.selected)
      .map((t) => ({
        template_id: t.id,
        category_id: t.category_id,
        budgeted_amount: parseFloat(t.amount as string),
        fixed: true,
      })),
    // custom…
    ...customs.map((c) => ({
      template_id: null,
      category_id: c.category, // this can be a string or number; ->> will coerce
      name: c.name,
      budgeted_amount: parseFloat(c.amount),
      fixed: false,
    })),
  ];

  const { data, error } = await supabase.rpc("create_new_budget_and_expenses", {
    _name: name,
    _expected_amt: expectedAmount,
    _start_date: startDate,
    _end_date: endDate,
    _lines: linesPayload, // ← raw objects, not JSON.stringify
  });

  if (error) handleSupabaseError(error, `creating budget "${name}"`);

  return data as string; // new_budget_id
}

/**
 * Deletes a budget by ID
 *
 * @param budgetId - The ID of the budget to delete
 * @returns Promise that resolves when the budget is deleted
 * @throws {SupabaseRequestError} If the database delete fails
 *
 * @example
 * ```typescript
 * await deleteBudgetClient(123);
 * ```
 */
export const deleteBudgetClient = async (budgetId: number): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("budget").delete().eq("id", budgetId);
  if (error) handleSupabaseError(error, `deleting budget ${budgetId}`);
};
