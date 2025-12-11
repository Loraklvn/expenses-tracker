import type {
  BudgetWithCurrent,
  CustomExpense,
  PreloadedExpenseTemplate,
} from "@/types";
import { getSupabaseClient } from "../../client";

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
  if (error) throw error;

  return {
    budgets: data || [],
    total: count || 0,
    page,
    pageSize,
  };
}

export const fetchBudgetClient = async (
  budgetId: number
): Promise<BudgetWithCurrent | null> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("budgets_with_current")
    .select("*")
    .eq("id", budgetId)
    .single();
  if (error) throw error;
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
 * Creates a budget plus all its expense lines (templated + custom).
 * Returns the new budget.id on success.
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

  if (error) throw error;

  return data as string; // new_budget_id
}

export const deleteBudgetClient = async (budgetId: number): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("budget").delete().eq("id", budgetId);
  if (error) throw error;
};
