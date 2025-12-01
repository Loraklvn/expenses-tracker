import { AnalyticsItem, MonthlyFlowData } from "@/lib/supabase/request/client";
import { Category, IncomeSource, ExpenseTemplate } from "@/types";

/**
 * Item 2: Group by Income Source
 */
export const aggregateByIncomeSource = (
  data: AnalyticsItem[]
): Record<number, number> => {
  const result: Record<number, number> = {};
  data.forEach((item) => {
    if (item.income_source_id) {
      result[item.income_source_id] =
        (result[item.income_source_id] || 0) + item.amount;
    }
  });
  return result; // Returns { [source_id]: total_amount }
};

/**
 * Items 3 & 4: Group by Category
 */
export const aggregateByCategory = (data: AnalyticsItem[]) => {
  const result: Record<number, number> = {};
  data.forEach((item) => {
    if (item.primary_category_id) {
      result[item.primary_category_id] =
        (result[item.primary_category_id] || 0) + item.amount;
    }
  });
  return result; // Returns { [category_id]: total_amount }
};

/**
 * Item 5: Group by Expense Template
 */
export const aggregateByTemplate = (data: AnalyticsItem[]) => {
  const result: Record<number, number> = {};
  data.forEach((item) => {
    if (item.template_id) {
      result[item.template_id] = (result[item.template_id] || 0) + item.amount;
    }
  });
  return result; // Returns { [template_id]: total_amount }
};

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
 */
export const formatIncomeSourceData = (
  aggregated: Record<number, number>,
  incomeSources: IncomeSource[]
): Array<{ name: string; value: number }> => {
  return Object.entries(aggregated)
    .map(([id, value]) => {
      const source = incomeSources.find((s) => s.id === Number(id));
      return {
        name: source?.name || `Unknown (${id})`,
        value,
      };
    })
    .sort((a, b) => b.value - a.value);
};

export const formatCategoryData = (
  aggregated: Record<number, number>,
  categories: Category[]
): Array<{ name: string; value: number; color?: string }> => {
  return Object.entries(aggregated)
    .map(([id, value]) => {
      const category = categories.find((c) => c.id === Number(id));
      return {
        name: category?.name || `Unknown (${id})`,
        value,
        color: category?.color,
      };
    })
    .sort((a, b) => b.value - a.value);
};

export const formatTemplateData = (
  aggregated: Record<number, number>,
  templates: ExpenseTemplate[]
): Array<{ name: string; value: number }> => {
  return Object.entries(aggregated)
    .map(([id, value]) => {
      const template = templates.find((t) => t.id === Number(id));
      return {
        name: template?.name || `Unknown (${id})`,
        value,
      };
    })
    .sort((a, b) => b.value - a.value);
};
