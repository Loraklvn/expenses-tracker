// lib/supabase/requests.ts
import { BudgetTemplateWithStats, Category, ExpenseTemplate } from "@/types";
import { createClient } from "../client";
import type {
  BudgetWithCurrent,
  CustomExpense,
  ExpenseWithCurrent,
  PreloadedExpenseTemplate,
  TransactionWithDetails,
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
  templateId: number;
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
  templateId: number
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

export type FetchTransactionsResult = {
  transactions: TransactionWithDetails[];
  total: number;
};

/**
 * Fetch one page of the user's transactions, plus the exact total count.
 * @param page 1-based page number
 * @param pageSize number of rows per page
 * @param searchTerm optional search term to filter by budget_name or expense_name
 */
export const fetchTransactionsClient = async (
  page: number = 1,
  pageSize: number = 10,
  searchTerm?: string
): Promise<FetchTransactionsResult> => {
  const supabase = createClient();

  // 1) Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw userError || new Error("Not authenticated");

  // 2) Compute range
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // 3) Build query
  let query = supabase
    .from("transactions_with_details")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false });

  // 4) Add search filter if searchTerm is provided
  if (searchTerm && searchTerm.trim()) {
    query = query.or(
      `expense_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,budget_name.ilike.%${searchTerm}%`
    );
  }

  // 5) Apply pagination
  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  return {
    transactions: data ?? [],
    total: count ?? 0,
  };
};

/**
 * Update a transaction's details
 * @param params Object containing transactionId and updates
 * @param updates Object containing the fields to update
 * @returns void
 */
export const updateTransactionClient = async (params: {
  transactionId: number;
  updates: {
    amount?: number;
    description?: string;
    transaction_date?: string;
  };
}): Promise<void> => {
  const { transactionId, updates } = params;
  const supabase = createClient();

  const { error } = await supabase
    .from("transaction")
    .update(updates)
    .eq("id", transactionId);

  if (error) throw error;
};

/**
 * Delete a transaction
 * @param params Object containing transactionId
 * @returns void
 */
export const deleteTransactionClient = async (params: {
  transactionId: number;
}): Promise<void> => {
  const { transactionId } = params;
  const supabase = createClient();

  const { error } = await supabase
    .from("transaction")
    .delete()
    .eq("id", transactionId);

  if (error) throw error;
};

export type CreateBudgetTemplateArgs = {
  name: string;
  description?: string;
  expenseTemplateIds: number[];
};

export async function createBudgetTemplateClient({
  name,
  description,
  expenseTemplateIds,
}: CreateBudgetTemplateArgs): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("create_budget_template", {
    p_name: name,
    p_description: description ?? "",
    p_expense_ids: expenseTemplateIds,
  });

  if (error) throw error;
  // data is the returned UUID
  return data as string;
}

export const fetchBudgetTemplatesClient = async (): Promise<
  BudgetTemplateWithStats[]
> => {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw userError || new Error("Not authenticated");

  const { data, error } = await supabase
    .from("budget_templates_with_stats")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
};

type UpdateBudgetTemplateArgs = {
  templateId: number;
  expenseTemplateIds: number[];
};

export async function updateBudgetTemplateClient({
  templateId,
  expenseTemplateIds,
}: UpdateBudgetTemplateArgs): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("update_budget_template", {
    p_template_id: templateId,
    p_expense_ids: expenseTemplateIds,
  });
  if (error) throw error;
}

export async function deleteBudgetTemplateClient(
  templateId: number
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("budget_template")
    .delete()
    .eq("id", templateId);
  if (error) throw error;
}
