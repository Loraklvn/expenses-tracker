import { getSupabaseClient } from "../../client";
import { getYYYYMMDDFromDate } from "@/utils/date";

// --- Interfaces based on your Views ---

export interface MonthlyFlowData {
  month_start: string;
  total_income: number;
  total_spending: number;
}

export interface AnalyticsItem {
  transaction_date: string;
  amount: number;
  primary_category_id: number | null;
  income_source_id: number | null;
  template_id: number | null;
}

export interface BudgetPerformanceData {
  average_completion_percentage: number;
  total_budgets: number;
}

// Aggregated analytics result types
export interface IncomeBySourceItem {
  income_source_id: number;
  income_source_name: string;
  total: number;
}

export interface IncomeByCategoryItem {
  primary_category_id: number;
  total: number;
}

export interface SpendingByCategoryItem {
  primary_category_id: number;
  total: number;
}

export interface SpendingByTemplateItem {
  template_id: number;
  total: number;
}

/**
 * Income & Spending Over Time (Items 1 & 7)
 * This function queries the monthly_flow_summary view.
 * For Item 7 (Month by Month): Use the data array returned directly.
 * For Item 1 (Total All Time): You can simply .reduce() the result array in the frontend to get the single total sum.
 */
export const getMonthlyFlow = async (
  startDate?: Date | string,
  endDate?: Date | string
): Promise<MonthlyFlowData[]> => {
  const supabase = getSupabaseClient();
  let query = supabase
    .from("monthly_flow_summary")
    .select("*")
    .order("month_start", { ascending: true });

  if (startDate)
    query = query.gte("month_start", getYYYYMMDDFromDate(startDate));
  if (endDate) query = query.lte("month_start", getYYYYMMDDFromDate(endDate));

  const { data, error } = await query;
  if (error) throw error;

  return data as MonthlyFlowData[];
};

/**
 * @deprecated Use getIncomeBySource, getIncomeByCategory, getSpendingByCategory, and getSpendingByTemplate instead.
 * These individual functions are more efficient as they perform aggregation at the database level.
 *
 * B. The Breakdown Functions (Items 2, 3, 4, 5)
 * Since the Supabase JS Client cannot perform GROUP BY operations natively on Views without complex workarounds, the most performant way for your app is to:
 * Fetch the granular data from analytics_breakdown.
 * Use a lightweight JavaScript helper to aggregate it. This reduces database load (one query vs four) and makes your UI snappier.
 */
export const getAnalyticsBreakdown = async (
  type: "income" | "expense",
  startDate?: Date | string,
  endDate?: Date | string
): Promise<AnalyticsItem[]> => {
  const supabase = getSupabaseClient();
  let query = supabase
    .from("analytics_breakdown")
    .select("amount, primary_category_id, income_source_id, template_id")
    .eq("type", type);

  // Default to all time if dates not provided
  if (startDate)
    query = query.gte("transaction_date", getYYYYMMDDFromDate(startDate));
  if (endDate)
    query = query.lte("transaction_date", getYYYYMMDDFromDate(endDate));

  const { data, error } = await query;
  if (error) throw error;

  return data as AnalyticsItem[];
};

export const getBudgetPerformance = async (
  startDate?: Date | string,
  endDate?: Date | string
) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("get_budget_performance", {
    _start_date: startDate ? getYYYYMMDDFromDate(startDate) : null,
    _end_date: endDate ? getYYYYMMDDFromDate(endDate) : null,
  });

  if (error) throw error;

  // RPC returns an array, but we know it's a single row
  return (
    data && data.length > 0 ? data[0] : null
  ) as BudgetPerformanceData | null;
};

/**
 * Item 2: Income by Source
 * Fetches aggregated income data grouped by income source.
 * SQL: SELECT income_source_id, SUM(amount) FROM analytics_breakdown WHERE type = 'income' AND transaction_date BETWEEN $1 AND $2 GROUP BY 1;
 */
export const getIncomeBySource = async (
  startDate?: Date | string,
  endDate?: Date | string
): Promise<IncomeBySourceItem[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("get_income_by_source", {
    _start_date: startDate ? getYYYYMMDDFromDate(startDate) : null,
    _end_date: endDate ? getYYYYMMDDFromDate(endDate) : null,
  });

  if (error) throw error;
  return (data || []) as IncomeBySourceItem[];
};

/**
 * Item 3: Income by Category
 * Fetches aggregated income data grouped by category.
 * SQL: SELECT primary_category_id, SUM(amount) FROM analytics_breakdown WHERE type = 'income' AND transaction_date BETWEEN $1 AND $2 GROUP BY 1;
 */
export const getIncomeByCategory = async (
  startDate?: Date | string,
  endDate?: Date | string
): Promise<IncomeByCategoryItem[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("get_income_by_category", {
    _start_date: startDate ? getYYYYMMDDFromDate(startDate) : null,
    _end_date: endDate ? getYYYYMMDDFromDate(endDate) : null,
  });

  if (error) throw error;
  return (data || []) as IncomeByCategoryItem[];
};

/**
 * Item 4: Spending by Category
 * Fetches aggregated expense data grouped by category.
 * SQL: SELECT primary_category_id, SUM(amount) FROM analytics_breakdown WHERE type = 'expense' AND transaction_date BETWEEN $1 AND $2 GROUP BY 1;
 */
export const getSpendingByCategory = async (
  startDate?: Date | string,
  endDate?: Date | string
): Promise<SpendingByCategoryItem[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("get_spending_by_category", {
    _start_date: startDate ? getYYYYMMDDFromDate(startDate) : null,
    _end_date: endDate ? getYYYYMMDDFromDate(endDate) : null,
  });

  if (error) throw error;
  return (data || []) as SpendingByCategoryItem[];
};

/**
 * Item 5: Spending by Template
 * Fetches aggregated expense data grouped by template.
 * SQL: SELECT template_id, SUM(amount) FROM analytics_breakdown WHERE type = 'expense' AND template_id IS NOT NULL AND transaction_date BETWEEN $1 AND $2 GROUP BY 1;
 */
export const getSpendingByTemplate = async (
  startDate?: Date | string,
  endDate?: Date | string
): Promise<SpendingByTemplateItem[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.rpc("get_spending_by_template", {
    _start_date: startDate ? getYYYYMMDDFromDate(startDate) : null,
    _end_date: endDate ? getYYYYMMDDFromDate(endDate) : null,
  });

  if (error) throw error;
  return (data || []) as SpendingByTemplateItem[];
};
