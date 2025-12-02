"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTranslations } from "next-intl";
import { BudgetPerformanceData } from "@/lib/supabase/request/client";

type BudgetPerformanceCardProps = {
  data: BudgetPerformanceData | null;
  isLoading?: boolean;
};

export default function BudgetPerformanceCard({
  data,
  isLoading = false,
}: BudgetPerformanceCardProps) {
  const t = useTranslations("analytics");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("budget_performance")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.total_budgets === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("budget_performance")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center text-muted-foreground">
            {t("no_data")}
          </div>
        </CardContent>
      </Card>
    );
  }

  const avgPercentage = Number(data.average_completion_percentage) || 0;
  const isOverBudget = avgPercentage > 100;
  const isWarning = avgPercentage > 80 && avgPercentage <= 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("budget_performance")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t("average_completion")}
            </span>
            <span
              className={`font-semibold text-lg ${
                isOverBudget
                  ? "text-red-600 dark:text-red-400"
                  : isWarning
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {avgPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={Math.min(avgPercentage, 100)}
            className="h-3"
            indicatorClassName={
              isOverBudget
                ? "bg-red-600"
                : isWarning
                ? "bg-orange-600"
                : "bg-green-600"
            }
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>
            {t("based_on_budgets")} {data.total_budgets}{" "}
            {data.total_budgets === 1 ? t("budget") : t("budgets")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
