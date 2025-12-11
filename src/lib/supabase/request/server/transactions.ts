import type { TransactionWithDetails } from "@/types";
import { createServer } from "../../server";

export const fetchTransactionsServer = async (
  page: number = 1,
  pageSize: number = 10,
  searchTerm?: string,
  type: "income" | "expense" = "expense"
): Promise<{ transactions: TransactionWithDetails[]; total: number }> => {
  const supabase = await createServer();

  let query = supabase
    .from("transactions_with_details")
    .select("*", { count: "exact" })
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
