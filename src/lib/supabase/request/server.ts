import {
  BudgetWithCurrent,
  Category,
  ExpenseTemplate,
  ExpenseWithCurrent,
  BudgetTemplateWithStats,
  TransactionWithDetails,
  IncomeSource,
} from "@/types";
import { createServer } from "../server";

export async function fetchBudgetsServer(
  page: number = 1,
  pageSize: number = 10
): Promise<BudgetWithCurrent[]> {
  const supabase = createServer();
  const { data, error } = await (
    await supabase
  )
    .from("budgets_with_current")
    .select("*")
    .range((page - 1) * pageSize, page * pageSize - 1)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export const fetchBudgetServer = async (
  budgetId: number
): Promise<BudgetWithCurrent | null> => {
  const supabase = createServer();
  const { data, error } = await (await supabase)
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
  const supabase = createServer();
  const { data, error } = await (await supabase)
    .from("expenses_with_current")
    .select("*")
    .eq("budget_id", budgetId);

  if (error) throw error;
  return data || [];
}

// Helper functions for different transaction types
export async function addBudgetedTransactionServer(
  expenseId: number,
  amount: number,
  description?: string
): Promise<void> {
  const supabase = await createServer();

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

export async function addUnbudgetedTransactionWithTemplateServer(
  templateId: number,
  amount: number,
  description?: string
): Promise<void> {
  const supabase = await createServer();

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

export async function addUnbudgetedTransactionWithCategoryServer(
  categoryId: number,
  amount: number,
  description?: string
): Promise<void> {
  const supabase = await createServer();

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

export async function addIncomeTransactionServer(
  incomeSourceId: number,
  amount: number,
  description?: string
): Promise<void> {
  const supabase = await createServer();

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
export async function addTransactionServer(
  expenseId: number,
  amount: number,
  description?: string
): Promise<void> {
  // For backward compatibility, we assume it's a budgeted expense
  return addBudgetedTransactionServer(expenseId, amount, description);
}

export const fetchExpensesTemplateServer = async (): Promise<
  ExpenseTemplate[]
> => {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("expense_template")
    .select("*")
    .eq("archived", false)
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
};

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

export const fetchTransactionsServer = async (
  page: number = 1,
  pageSize: number = 10,
  searchTerm?: string,
  type: "income" | "expense" = "expense"
): Promise<{ transactions: TransactionWithDetails[]; total: number }> => {
  const supabase = await createServer();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) throw userError;

  let query = supabase
    .from("transactions_with_details")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .eq("type", type) // filter by type
    .order("transaction_date", { ascending: false });

  if (searchTerm) {
    query = query.or(
      `expense_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,budget_name.ilike.%${searchTerm}%`
    );
  }

  const { data, error, count } = await query.range(
    (page - 1) * pageSize,
    page * pageSize - 1
  );

  if (error) throw error;

  return {
    transactions: data || [],
    total: count || 0,
  };
};

export const fetchBudgetTemplatesServer = async (): Promise<
  BudgetTemplateWithStats[]
> => {
  const supabase = await createServer();
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

export const fetchBudgetTemplateServer = async (
  templateId: number
): Promise<BudgetTemplateWithStats | null> => {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("budget_templates_with_stats")
    .select("*")
    .eq("id", templateId)
    .single();
  if (error) return null;
  return data || null;
};

// Income Source Management Functions
export const fetchIncomeSourcesServer = async (): Promise<IncomeSource[]> => {
  const supabase = await createServer();
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

export const createIncomeSourceServer = async (
  args: IncomeSourcePayload
): Promise<void> => {
  const supabase = await createServer();
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

export const updateIncomeSourceServer = async ({
  incomeSourceId,
  updates,
}: {
  incomeSourceId: number;
  updates: Partial<IncomeSourcePayload>;
}): Promise<void> => {
  const supabase = await createServer();
  const { error } = await supabase
    .from("income_source")
    .update(updates)
    .eq("id", incomeSourceId);
  if (error) throw error;
};

export const archiveIncomeSourceServer = async (
  incomeSourceId: number
): Promise<void> => {
  const supabase = await createServer();
  const { error } = await supabase
    .from("income_source")
    .update({ active: false })
    .eq("id", incomeSourceId);
  if (error) throw error;
};
