// lib/supabase/requests.ts
import { Budget, Category, Expense, ExpenseTemplate } from "@/types";
import { createClient } from "./client";

/** Client-side: fetch budgets (you can wrap this in React-Query if you like) */
export type BudgetWithCurrent = Budget & { current_amount: number };
export async function fetchBudgetsClient(): Promise<BudgetWithCurrent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("budgets_with_current")
    .select("*");
  if (error) throw error;
  return data || [];
}

export const fetchBudgetClient = async (
  budgetId: number
): Promise<BudgetWithCurrent | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("budgets_with_current")
    .select("*")
    .eq("id", budgetId)
    .single();
  if (error) throw error;
  return data || null;
};

export type ExpenseWithCurrent = Expense & { current_amount: number };
export async function fetchExpensesClient(
  budgetId: number
): Promise<ExpenseWithCurrent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("expenses_with_current")
    .select("*")
    .eq("budget_id", budgetId);

  if (error) throw error;
  return data || [];
}

export async function addTransactionClient(
  expenseId: number,
  amount: number,
  description?: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("transaction").insert([
    {
      expense_id: expenseId,
      amount,
      description,
    },
  ]);
  if (error) throw error;
}

export const fetchExpensesTemplateClient = async (): Promise<
  ExpenseTemplate[]
> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("expense_template")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
};

export const fetchCategoriesClient = async (): Promise<Category[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
};

// lib/supabase/requests.ts
import type { PreloadedExpenseTemplate, CustomExpense } from "@/types";

export interface CreateBudgetArgs {
  name: string;
  expectedAmount: number;
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
  templates,
  customs,
}: CreateBudgetArgs): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw userError || new Error("Not authenticated");

  console.log({ user, name, expectedAmount, templates, customs });

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

  const { data, error } = await supabase.rpc("create_budget_with_lines", {
    _user_id: user.id,
    _name: name,
    _expected_amt: expectedAmount,
    _lines: linesPayload, // ← raw objects, not JSON.stringify
  });

  if (error) throw error;

  return data as string; // new_budget_id
}

// Server-side: fetch budgets
export async function fetchBudgetsServer(): Promise<BudgetWithCurrent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("budgets_with_current")
    .select("*");
  if (error) throw error;
  return data || [];
}
export const fetchBudgetServer = async (
  budgetId: number
): Promise<BudgetWithCurrent | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("budgets_with_current")
    .select("*")
    .eq("id", budgetId)
    .single();
  if (error) throw error;
  return data || null;
};
export async function fetchExpensesServer(
  budgetId: number
): Promise<ExpenseWithCurrent[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("expenses_with_current")
    .select("*")
    .eq("budget_id", budgetId);

  if (error) throw error;
  return data || [];
}
export async function addTransactionServer(
  expenseId: number,
  amount: number,
  description?: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("transaction").insert([
    {
      expense_id: expenseId,
      amount,
      description,
    },
  ]);
  if (error) throw error;
}
