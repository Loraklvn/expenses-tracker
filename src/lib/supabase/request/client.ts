// lib/supabase/requests.ts
import {
  BudgetTemplateWithStats,
  Category,
  ExpenseTemplate,
  IncomeSource,
} from "@/types";
import { createClient } from "../client";
import type {
  BudgetWithCurrent,
  CustomExpense,
  ExpenseWithCurrent,
  PreloadedExpenseTemplate,
  TransactionWithDetails,
} from "@/types";

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
  const supabase = createClient();

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
  const supabase = createClient();
  const { data, error } = await supabase
    .from("budgets_with_current")
    .select("*")
    .eq("id", budgetId)
    .single();
  if (error) throw error;
  return data || null;
};

type AddExpenseToBudgetArgs = {
  expenseTemplate: ExpenseTemplate;
  budgetId: number;
};

export const addExpenseToBudgetClient = async ({
  expenseTemplate,
  budgetId,
}: AddExpenseToBudgetArgs): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.from("budget_expense").insert([
    {
      template_id: expenseTemplate.id,
      budget_id: budgetId,
      budgeted_amount: expenseTemplate.default_amount,
      category_id: expenseTemplate.category_id,
    },
  ]);
  if (error) throw error;
};

type AddCustomExpenseToBudgetArgs = {
  name: string;
  categoryId: number;
  amount: number;
  budgetId: number;
};

export const addCustomExpenseToBudgetClient = async ({
  name,
  categoryId,
  amount,
  budgetId,
}: AddCustomExpenseToBudgetArgs): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.from("budget_expense").insert([
    {
      name,
      category_id: categoryId,
      budget_id: budgetId,
      budgeted_amount: amount,
    },
  ]);
  if (error) throw error;
};

type UpdateBudgetExpenseArgs = {
  expenseId: number;
  name?: string;
  description?: string;
  amount: number;
};

export const updateBudgetExpenseClient = async ({
  expenseId,
  name,
  description,
  amount,
}: UpdateBudgetExpenseArgs): Promise<void> => {
  const updates: Record<string, unknown> = {
    budgeted_amount: amount,
  };
  if (name) updates.name = name;
  if (description) updates.description = description;

  const supabase = createClient();
  const { error } = await supabase
    .from("budget_expense")
    .update(updates)
    .eq("id", expenseId);
  if (error) throw error;
};

export const deleteBudgetExpenseClient = async (
  expenseId: number
): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("budget_expense")
    .delete()
    .eq("id", expenseId);
  if (error) throw error;
};

export const deleteBudgetClient = async (budgetId: number): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase.from("budget").delete().eq("id", budgetId);
  if (error) throw error;
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

// Helper functions for different transaction types
export async function addBudgetedTransaction(
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
      type: "expense",
    },
  ]);

  if (error) throw error;
}

export async function addUnbudgetedTransactionWithTemplate(
  templateId: number,
  amount: number,
  description?: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("transaction").insert([
    {
      template_id: templateId,
      amount,
      description,
      type: "expense",
    },
  ]);

  if (error) throw error;
}

export async function addUnbudgetedTransactionWithCategory(
  categoryId: number,
  amount: number,
  description?: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("transaction").insert([
    {
      category_id: categoryId,
      amount,
      description,
      type: "expense",
    },
  ]);

  if (error) throw error;
}

export async function addIncomeTransaction(
  incomeSourceId: number,
  amount: number,
  description?: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.from("transaction").insert([
    {
      income_source_id: incomeSourceId,
      amount,
      description,
      type: "income",
    },
  ]);

  if (error) throw error;
}

// Legacy function for backward compatibility
export async function addTransactionClient(
  expenseId: number,
  amount: number,
  description?: string
): Promise<void> {
  // For backward compatibility, we assume it's a budgeted expense
  return addBudgetedTransaction(expenseId, amount, description);
}

export const fetchExpensesTemplateClient = async (): Promise<
  ExpenseTemplate[]
> => {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw userError || new Error("Not authenticated");

  const { data, error } = await supabase
    .from("expense_template")
    .select("*")
    .eq("archived", false) // filter out archived templates
    .eq("user_id", user.id) // filter by user id
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

type FetchCategoriesArgs = {
  archived?: boolean;
  type?: "income" | "expense" | "all";
};

export const fetchCategoriesClient = async ({
  archived = false,
  type = "expense",
}: FetchCategoriesArgs = {}): Promise<Category[]> => {
  const supabase = createClient();
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
      type,
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

type FetchTransactionsArgs = {
  page: number;
  pageSize: number;
  searchTerm?: string;
  type?: "income" | "expense" | "all";
};
export const fetchTransactionsClient = async ({
  page = 1,
  pageSize = 10,
  searchTerm,
  type = "all",
}: FetchTransactionsArgs): Promise<FetchTransactionsResult> => {
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

  if (type !== "all") {
    query.eq("type", type);
  }

  // 4) Add search filter if searchTerm is provided
  if (searchTerm && searchTerm.trim()) {
    query = query.or(
      `expense_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,budget_name.ilike.%${searchTerm}%,income_source_name.ilike.%${searchTerm}%`
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
  name: string;
  description: string;
  expenseTemplateIds: number[];
};

export async function updateBudgetTemplateClient({
  name,
  description,
  templateId,
  expenseTemplateIds,
}: UpdateBudgetTemplateArgs): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("update_budget_template", {
    p_template_id: templateId,
    p_name: name,
    p_description: description,
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

// Income Source Management Functions
export const fetchIncomeSourcesClient = async (): Promise<IncomeSource[]> => {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw userError || new Error("Not authenticated");

  const { data, error } = await supabase
    .from("income_source")
    .select("*")
    .eq("user_id", user.id)
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
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw userError || new Error("Not authenticated");

  const { error } = await supabase.from("income_source").insert([
    {
      ...args,
      user_id: user.id,
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
  const supabase = createClient();
  const { error } = await supabase
    .from("income_source")
    .update(updates)
    .eq("id", incomeSourceId);
  if (error) throw error;
};

export const archiveIncomeSourceClient = async (
  incomeSourceId: number
): Promise<void> => {
  const supabase = createClient();
  const { error } = await supabase
    .from("income_source")
    .update({ active: false })
    .eq("id", incomeSourceId);
  if (error) throw error;
};

// Income Transaction Management Functions
export const fetchIncomeTransactionsClient = async ({
  page = 1,
  pageSize = 10,
  searchTerm,
}: {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}): Promise<FetchTransactionsResult> => {
  return fetchTransactionsClient({
    page,
    pageSize,
    searchTerm,
    type: "income",
  });
};

export const createIncomeTransactionClient = async ({
  incomeSourceId,
  amount,
  description,
  transactionDate,
}: {
  incomeSourceId: number;
  amount: number;
  description?: string;
  transactionDate?: string;
}): Promise<void> => {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw userError || new Error("Not authenticated");

  const { error } = await supabase.from("transaction").insert([
    {
      income_source_id: incomeSourceId,
      amount,
      description,
      type: "income",
      transaction_date:
        transactionDate || new Date().toISOString().split("T")[0],
    },
  ]);

  if (error) throw error;
};
