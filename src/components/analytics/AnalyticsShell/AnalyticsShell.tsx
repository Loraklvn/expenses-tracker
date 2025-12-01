"use client";
import StickyHeader from "@/components/common/StickyHeader";
import {
  BudgetPerformanceData,
  fetchCategoriesClient,
  fetchExpensesTemplateClient,
  fetchIncomeSourcesClient,
  getAnalyticsBreakdown,
  getBudgetPerformance,
  getMonthlyFlow,
} from "@/lib/supabase/request/client";
import {
  aggregateByCategory,
  aggregateByIncomeSource,
  aggregateByTemplate,
  calculateTotalFlow,
  formatCategoryData,
  formatIncomeSourceData,
  formatTemplateData,
} from "@/utils/dashboard";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { getLastDayOfMonthDate, getYYYYMMDDFromDate } from "@/utils/date";
import BudgetPerformanceCard from "../BudgetPerformanceCard";
import DateRangeFilter from "../DateRangeFilter";
import IncomeByCategoryChart from "../IncomeByCategoryChart";
import IncomeBySourceChart from "../IncomeBySourceChart";
import MonthlyFlowChart from "../MonthlyFlowChart";
import SpendingByCategoryChart from "../SpendingByCategoryChart";
import SpendingByTemplateChart from "../SpendingByTemplateChart";
import TotalFlowCard from "../TotalFlowCard";

export default function AnalyticsShell() {
  const t = useTranslations("analytics");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // Fetch reference data (categories, income sources, templates)
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategoriesClient({ type: "all" }),
  });

  const { data: incomeSources = [] } = useQuery({
    queryKey: ["incomeSources"],
    queryFn: () => fetchIncomeSourcesClient(),
  });

  const { data: expenseTemplates = [] } = useQuery({
    queryKey: ["expenseTemplates"],
    queryFn: () => fetchExpensesTemplateClient(),
  });

  // Fetch monthly flow data (Items 1 & 7)
  const { data: monthlyFlowData = [], isLoading: isLoadingMonthlyFlow } =
    useQuery({
      queryKey: ["monthlyFlow", startDate, endDate],
      queryFn: () => getMonthlyFlow(startDate, endDate),
    });

  // Fetch income breakdown data (Items 2 & 3)
  const { data: incomeBreakdown = [], isLoading: isLoadingIncomeBreakdown } =
    useQuery({
      queryKey: ["incomeBreakdown", startDate, endDate],
      queryFn: () => getAnalyticsBreakdown("income", startDate, endDate),
    });

  // Fetch expense breakdown data (Items 4 & 5)
  const { data: expenseBreakdown = [], isLoading: isLoadingExpenseBreakdown } =
    useQuery({
      queryKey: ["expenseBreakdown", startDate, endDate],
      queryFn: () => getAnalyticsBreakdown("expense", startDate, endDate),
    });

  // Fetch budget performance (Item 6)
  const { data: budgetPerformance, isLoading: isLoadingBudgetPerformance } =
    useQuery({
      queryKey: ["budgetPerformance", startDate, endDate],
      queryFn: () => getBudgetPerformance(startDate, endDate),
    });

  // Process data
  const totalFlow = calculateTotalFlow(monthlyFlowData);

  const incomeBySourceAggregated = aggregateByIncomeSource(incomeBreakdown);
  const incomeBySourceData = formatIncomeSourceData(
    incomeBySourceAggregated,
    incomeSources
  );

  const incomeByCategoryAggregated = aggregateByCategory(incomeBreakdown);
  const incomeCategories = categories.filter((c) => c.type === "income");
  const incomeByCategoryData = formatCategoryData(
    incomeByCategoryAggregated,
    incomeCategories
  );

  const spendingByCategoryAggregated = aggregateByCategory(expenseBreakdown);
  const expenseCategories = categories.filter((c) => c.type === "expense");
  const spendingByCategoryData = formatCategoryData(
    spendingByCategoryAggregated,
    expenseCategories
  );

  const spendingByTemplateAggregated = aggregateByTemplate(expenseBreakdown);
  const spendingByTemplateData = formatTemplateData(
    spendingByTemplateAggregated,
    expenseTemplates
  );

  // const isLoading =
  //   isLoadingMonthlyFlow ||
  //   isLoadingIncomeBreakdown ||
  //   isLoadingExpenseBreakdown ||
  //   isLoadingBudgetPerformance;

  console.log({ monthlyFlowData });

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-background">
      <div className="max-w-md mx-auto">
        <StickyHeader title={t("title")} description={t("description")} />

        <div className="p-4 space-y-6">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          {/* Item 1: Total All Time */}
          <TotalFlowCard
            totalIncome={totalFlow.totalIncome}
            totalSpending={totalFlow.totalSpending}
            isLoading={isLoadingMonthlyFlow}
            dateFrom={monthlyFlowData[0]?.month_start || ""}
            dateTo={(() => {
              const lastMonth = monthlyFlowData[monthlyFlowData.length - 1];
              if (!lastMonth?.month_start) return "";
              // month_start is in "YYYY-MM" format
              const [year, month] = lastMonth.month_start
                .split("-")
                .map(Number);
              const lastDay = getLastDayOfMonthDate(year, month - 1); // month is 1-indexed in string, 0-indexed in Date
              return getYYYYMMDDFromDate(lastDay);
            })()}
          />

          {/* Item 7: Month by Month */}
          <MonthlyFlowChart
            data={monthlyFlowData}
            isLoading={isLoadingMonthlyFlow}
          />

          {/* Item 2: Income by Source */}
          <IncomeBySourceChart
            data={incomeBySourceData}
            isLoading={isLoadingIncomeBreakdown}
          />

          {/* Item 3: Income by Category */}
          <IncomeByCategoryChart
            data={incomeByCategoryData}
            isLoading={isLoadingIncomeBreakdown}
          />

          {/* Item 4: Spending by Category */}
          <SpendingByCategoryChart
            data={spendingByCategoryData}
            isLoading={isLoadingExpenseBreakdown}
          />

          {/* Item 5: Spending by Template */}
          <SpendingByTemplateChart
            data={spendingByTemplateData}
            isLoading={isLoadingExpenseBreakdown}
          />

          {/* Item 6: Budget Performance */}
          <BudgetPerformanceCard
            data={budgetPerformance as BudgetPerformanceData}
            isLoading={isLoadingBudgetPerformance}
          />
        </div>
      </div>
    </div>
  );
}
