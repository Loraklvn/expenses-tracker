import type { TransactionWithDetails } from "@/types";
import { getSupabaseClient } from "../../client";

// Helper functions for different transaction types
export async function addBudgetedTransaction(
  expenseId: number,
  amount: number,
  transactionDate: string,
  description?: string
): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.from("transaction").insert([
    {
      expense_id: expenseId,
      amount,
      description,
      type: "expense",
      transaction_date: transactionDate,
    },
  ]);

  if (error) throw error;
}

export async function addUnbudgetedTransactionWithTemplate(
  templateId: number,
  amount: number,
  description?: string
): Promise<void> {
  const supabase = getSupabaseClient();

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
  const supabase = getSupabaseClient();

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
  const supabase = getSupabaseClient();

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
  transactionDate: string,
  description?: string
): Promise<void> {
  // For backward compatibility, we assume it's a budgeted expense
  return addBudgetedTransaction(
    expenseId,
    amount,
    transactionDate,
    description
  );
}

export type FetchTransactionsResult = {
  transactions: TransactionWithDetails[];
  total: number;
};

export type FetchTransactionsArgs = {
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
  const supabase = getSupabaseClient();

  // 2) Compute range
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // 3) Build query
  let query = supabase
    .from("transactions_with_details")
    .select("*", { count: "exact" })
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
  const supabase = getSupabaseClient();

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
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from("transaction")
    .delete()
    .eq("id", transactionId);

  if (error) throw error;
};

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
  const supabase = getSupabaseClient();

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
