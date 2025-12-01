"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/utils/numbers";
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

  if (!data) {
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

  const isOverBudget = data.spent_percentage > 100;
  const isWarning = data.spent_percentage > 80;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("budget_performance")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("total_budgeted")}</span>
            <span className="font-semibold">
              {formatCurrency(data.total_budgeted)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("total_spent")}</span>
            <span
              className={`font-semibold ${
                isOverBudget
                  ? "text-red-600 dark:text-red-400"
                  : isWarning
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {formatCurrency(data.total_spent)}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t("spent_percentage")}
            </span>
            <span
              className={`font-semibold ${
                isOverBudget
                  ? "text-red-600 dark:text-red-400"
                  : isWarning
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {data.spent_percentage.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={Math.min(data.spent_percentage, 100)}
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
      </CardContent>
    </Card>
  );
}

