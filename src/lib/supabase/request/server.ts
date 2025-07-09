import {
  BudgetWithCurrent,
  Category,
  ExpenseTemplate,
  ExpenseWithCurrent,
  BudgetTemplateWithStats,
  TransactionWithDetails,
} from "@/types";
import { createServer } from "../server";

export async function fetchBudgetsServer(): Promise<BudgetWithCurrent[]> {
  const supabase = createServer();
  const { data, error } = await (await supabase)
    .from("budgets_with_current")
    .select("*")
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

export async function addTransactionServer(
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
    },
  ]);
  if (error) throw error;
}

export const fetchExpensesTemplateServer = async (): Promise<
  ExpenseTemplate[]
> => {
  const supabase = await createServer();
  const { data, error } = await supabase.from("expense_template").select("*");
  if (error) throw error;
  return data || [];
};

export const fetchCategoriesServer = async (): Promise<Category[]> => {
  const supabase = await createServer();
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .eq("archived", false);
  if (error) throw error;
  return data || [];
};

export const fetchTransactionsServer = async (
  page: number = 1,
  pageSize: number = 10,
  searchTerm?: string
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
