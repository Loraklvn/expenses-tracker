import {
  IncomeByCategoryItem,
  IncomeBySourceItem,
  MonthlyFlowData,
  SpendingByCategoryItem,
  SpendingByTemplateItem,
} from "@/lib/supabase/request/client";
import { Category, ExpenseTemplate } from "@/types";

/**
 * Item 1: Calculate total income and spending all time
 */
export const calculateTotalFlow = (
  data: MonthlyFlowData[]
): { totalIncome: number; totalSpending: number } => {
  return data.reduce(
    (acc, month) => ({
      totalIncome: acc.totalIncome + month.total_income,
      totalSpending: acc.totalSpending + month.total_spending,
    }),
    { totalIncome: 0, totalSpending: 0 }
  );
};

/**
 * Format aggregated data with names for display
 * Works directly with aggregated array results from RPC queries
 */
export const formatIncomeSourceData = (
  aggregated: IncomeBySourceItem[]
): Array<{ name: string; value: number }> => {
  // Data is already sorted by total DESC from the SQL query
  // Income source name is included directly from the database
  return aggregated.map((item) => ({
    name: item.income_source_name || `Unknown (${item.income_source_id})`,
    value: Number(item.total),
  }));
};

export const formatCategoryData = (
  aggregated: IncomeByCategoryItem[] | SpendingByCategoryItem[],
  categories: Category[]
): Array<{ name: string; value: number; color?: string }> => {
  return aggregated
    .map((item) => {
      const category = categories.find(
        (c) => c.id === item.primary_category_id
      );
      return {
        name: category?.name || `Unknown (${item.primary_category_id})`,
        value: Number(item.total),
        color: category?.color,
      };
    })
    .sort((a, b) => b.value - a.value);
};

export const formatTemplateData = (
  aggregated: SpendingByTemplateItem[],
  templates: ExpenseTemplate[]
): Array<{ name: string; value: number }> => {
  return aggregated
    .map((item) => {
      const template = templates.find((t) => t.id === item.template_id);
      return {
        name: template?.name || `Unknown (${item.template_id})`,
        value: Number(item.total),
      };
    })
    .sort((a, b) => b.value - a.value);
};
