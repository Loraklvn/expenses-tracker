"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/utils/numbers";
import { formatDateToReadable } from "@/utils/date";

type AverageMonthlyFlowCardProps = {
  averageIncome: number;
  averageSpending: number;
  dateFrom: string;
  dateTo: string;
  monthCount: number;
  isLoading?: boolean;
};

export default function AverageMonthlyFlowCard({
  averageIncome,
  averageSpending,
  dateFrom,
  dateTo,
  monthCount,
  isLoading = false,
}: AverageMonthlyFlowCardProps) {
  const t = useTranslations("analytics");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("average_monthly_flow")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-16 bg-muted animate-pulse rounded" />
            <div className="h-16 bg-muted animate-pulse rounded" />
            <div className="h-16 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const netAverage = averageIncome - averageSpending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("average_monthly_flow")}</CardTitle>
        <CardDescription className="space-y-1">
          <p>
            {t("from")}{" "}
            <span className="font-bold underline">
              {dateFrom ? formatDateToReadable(dateFrom) : "—"}
            </span>{" "}
            {t("to")}{" "}
            <span className="font-bold underline">
              {dateTo ? formatDateToReadable(dateTo) : "—"}
            </span>
          </p>
          <p className="text-muted-foreground">
            {t("across_months", { count: monthCount })}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
          <div>
            <p className="text-sm text-muted-foreground">
              {t("average_income_per_month")}
            </p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {formatCurrency(averageIncome)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
          <div>
            <p className="text-sm text-muted-foreground">
              {t("average_spending_per_month")}
            </p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">
              {formatCurrency(averageSpending)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">
              {t("average_net_per_month")}
            </p>
            <p
              className={`text-2xl font-bold ${
                netAverage >= 0
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              {formatCurrency(netAverage)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
