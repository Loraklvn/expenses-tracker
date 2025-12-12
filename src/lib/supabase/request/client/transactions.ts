import type { TransactionWithDetails } from "@/types";
import { getSupabaseClient } from "../../client";
import { handleSupabaseError } from "../utils/error-handler";

/**
 * Adds a transaction for a budgeted expense
 *
 * @param expenseId - The ID of the budget expense this transaction belongs to
 * @param amount - The transaction amount
 * @param transactionDate - The date of the transaction (YYYY-MM-DD format)
 * @param description - Optional description for the transaction
 * @returns Promise that resolves when the transaction is created
 * @throws {SupabaseRequestError} If the database insert fails
 *
 * @example
 * ```typescript
 * await addBudgetedTransaction(123, 50.00, "2024-01-15", "Grocery shopping");
 * ```
 */
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

  if (error)
    handleSupabaseError(
      error,
      `adding budgeted transaction for expense ${expenseId}`
    );
}

/**
 * Adds an unbudgeted transaction linked to an expense template
 *
 * @param templateId - The ID of the expense template
 * @param amount - The transaction amount
 * @param description - Optional description for the transaction
 * @returns Promise that resolves when the transaction is created
 * @throws {SupabaseRequestError} If the database insert fails
 *
 * @example
 * ```typescript
 * await addUnbudgetedTransactionWithTemplate(5, 75.50, "One-time purchase");
 * ```
 */
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

  if (error)
    handleSupabaseError(
      error,
      `adding unbudgeted transaction with template ${templateId}`
    );
}

/**
 * Adds an unbudgeted transaction linked only to a category
 *
 * @param categoryId - The ID of the category for this transaction
 * @param amount - The transaction amount
 * @param description - Optional description for the transaction
 * @returns Promise that resolves when the transaction is created
 * @throws {SupabaseRequestError} If the database insert fails
 *
 * @example
 * ```typescript
 * await addUnbudgetedTransactionWithCategory(3, 25.00, "Misc expense");
 * ```
 */
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

  if (error)
    handleSupabaseError(
      error,
      `adding unbudgeted transaction with category ${categoryId}`
    );
}

/**
 * Adds an income transaction
 *
 * @param incomeSourceId - The ID of the income source
 * @param amount - The transaction amount
 * @param description - Optional description for the transaction
 * @returns Promise that resolves when the transaction is created
 * @throws {SupabaseRequestError} If the database insert fails
 *
 * @example
 * ```typescript
 * await addIncomeTransaction(2, 3000.00, "Monthly salary");
 * ```
 */
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

  if (error)
    handleSupabaseError(
      error,
      `adding income transaction for source ${incomeSourceId}`
    );
}

/**
 * Legacy function for adding a transaction (backward compatibility)
 * This function assumes the transaction is for a budgeted expense
 *
 * @deprecated Use addBudgetedTransaction, addUnbudgetedTransactionWithTemplate,
 * addUnbudgetedTransactionWithCategory, or addIncomeTransaction instead
 * @param expenseId - The ID of the budget expense
 * @param amount - The transaction amount
 * @param transactionDate - The date of the transaction (YYYY-MM-DD format)
 * @param description - Optional description for the transaction
 * @returns Promise that resolves when the transaction is created
 * @throws {SupabaseRequestError} If the database insert fails
 */
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
/**
 * Fetches a paginated list of transactions with optional filtering and search
 *
 * @param args - Query parameters for fetching transactions
 * @param args.page - Page number (default: 1)
 * @param args.pageSize - Number of items per page (default: 10)
 * @param args.searchTerm - Optional search term to filter transactions by name, description, budget, or income source
 * @param args.type - Filter by transaction type: "income", "expense", or "all" (default: "all")
 * @returns Promise resolving to paginated transactions with total count
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const result = await fetchTransactionsClient({
 *   page: 1,
 *   pageSize: 20,
 *   searchTerm: "grocery",
 *   type: "expense"
 * });
 * ```
 */
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

  if (error) handleSupabaseError(error, "fetching transactions");

  return {
    transactions: data ?? [],
    total: count ?? 0,
  };
};

/**
 * Updates a transaction's details
 *
 * @param params - Object containing transaction ID and fields to update
 * @param params.transactionId - The ID of the transaction to update
 * @param params.updates - Object containing the fields to update
 * @param params.updates.amount - Optional new amount for the transaction
 * @param params.updates.description - Optional new description
 * @param params.updates.transaction_date - Optional new transaction date (YYYY-MM-DD format)
 * @returns Promise that resolves when the transaction is updated
 * @throws {SupabaseRequestError} If the database update fails
 *
 * @example
 * ```typescript
 * await updateTransactionClient({
 *   transactionId: 456,
 *   updates: { amount: 75.50, description: "Updated description" }
 * });
 * ```
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

  if (error)
    handleSupabaseError(error, `updating transaction ${transactionId}`);
};

/**
 * Deletes a transaction by ID
 *
 * @param params - Object containing the transaction ID
 * @param params.transactionId - The ID of the transaction to delete
 * @returns Promise that resolves when the transaction is deleted
 * @throws {SupabaseRequestError} If the database delete fails
 *
 * @example
 * ```typescript
 * await deleteTransactionClient({ transactionId: 456 });
 * ```
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

  if (error)
    handleSupabaseError(error, `deleting transaction ${transactionId}`);
};

/**
 * Fetches a paginated list of income transactions with optional search
 *
 * This is a convenience function that calls fetchTransactionsClient with type="income"
 *
 * @param args - Query parameters for fetching income transactions
 * @param args.page - Page number (default: 1)
 * @param args.pageSize - Number of items per page (default: 10)
 * @param args.searchTerm - Optional search term to filter transactions
 * @returns Promise resolving to paginated income transactions with total count
 * @throws {SupabaseRequestError} If the database query fails
 *
 * @example
 * ```typescript
 * const result = await fetchIncomeTransactionsClient({
 *   page: 1,
 *   pageSize: 20,
 *   searchTerm: "salary"
 * });
 * ```
 */
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

/**
 * Creates an income transaction with an optional date (defaults to today)
 *
 * @param args - Income transaction parameters
 * @param args.incomeSourceId - The ID of the income source
 * @param args.amount - The transaction amount
 * @param args.description - Optional description for the transaction
 * @param args.transactionDate - Optional transaction date (YYYY-MM-DD format), defaults to today
 * @returns Promise that resolves when the transaction is created
 * @throws {SupabaseRequestError} If the database insert fails
 *
 * @example
 * ```typescript
 * await createIncomeTransactionClient({
 *   incomeSourceId: 2,
 *   amount: 3000.00,
 *   description: "Monthly salary",
 *   transactionDate: "2024-01-15"
 * });
 * ```
 */
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

  if (error)
    handleSupabaseError(
      error,
      `creating income transaction for source ${incomeSourceId}`
    );
};
