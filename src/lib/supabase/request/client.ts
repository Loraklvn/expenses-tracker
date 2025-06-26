// lib/supabase/requests.ts
import { Category, ExpenseTemplate } from "@/types";
import { createClient } from "../client";
import type {
  BudgetWithCurrent,
  CustomExpense,
  ExpenseWithCurrent,
  PreloadedExpenseTemplate,
} from "@/types";

/** Client-side: fetch budgets (you can wrap this in React-Query if you like) */
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
    .eq("archived", false) // filter out archived templates
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
};

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
export type PostExpenseTemplateArgs = {
  name: string;
  category_id: number;
  default_amount: number;
};
export const postExpenseTemplateClient = async (
  args: PostExpenseTemplateArgs
): Promise<void> => {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw userError || new Error("Not authenticated");

  const { error } = await supabase.from("expense_template").insert([
    {
      ...args,
      user_id: user.id,
    },
  ]);
  if (error) throw error;
};

export const updateExpenseTemplateClient = async ({
  templateId,
  args,
}: {
  templateId: string;
  args: Partial<PostExpenseTemplateArgs>;
}): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("expense_template")
    .update(args)
    .eq("id", templateId);
  if (error) throw error;
};

export const archiveExpenseTemplateClient = async (
  templateId: string
): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("expense_template")
    .update({ archived: true })
    .eq("id", templateId);
  if (error) throw error;
};

// Categories helper functions
export const fetchCategoriesClient = async (): Promise<Category[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .order("name", { ascending: true })
    .eq("archived", false);
  if (error) throw error;
  return data || [];
};

type CategoryPayload = {
  name: string;
  description?: string;
  color: string;
};
export const createCategoryClient = async ({
  name,
  description,
  color,
}: CategoryPayload): Promise<void> => {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw userError || new Error("Not authenticated");

  const { error } = await supabase.from("category").insert([
    {
      name,
      description,
      color,
      user_id: user.id, // associate with the current user
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
  const supabase = createClient();
  const { error } = await supabase
    .from("category")
    .update(updates)
    .eq("id", categoryId);
  if (error) throw error;
};

export const archiveCategoryClient = async (
  categoryId: number
): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("category")
    .update({ archived: true })
    .eq("id", categoryId);
  if (error) throw error;
};
