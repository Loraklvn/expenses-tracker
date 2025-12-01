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

type TotalFlowCardProps = {
  totalIncome: number;
  totalSpending: number;
  dateFrom: string;
  dateTo: string;
  isLoading?: boolean;
};

export default function TotalFlowCard({
  totalIncome,
  totalSpending,
  dateFrom,
  dateTo,
  isLoading = false,
}: TotalFlowCardProps) {
  const t = useTranslations("analytics");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("total_flow_for_period")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-16 bg-muted animate-pulse rounded" />
            <div className="h-16 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const netFlow = totalIncome - totalSpending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("total_flow_for_period")}</CardTitle>
        <CardDescription>
          {t("from")}{" "}
          <span className="font-bold underline">
            {formatDateToReadable(dateFrom)}
          </span>{" "}
          {t("to")}{" "}
          <span className="font-bold underline">
            {formatDateToReadable(dateTo)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
          <div>
            <p className="text-sm text-muted-foreground">{t("total_income")}</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {formatCurrency(totalIncome)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
          <div>
            <p className="text-sm text-muted-foreground">
              {t("total_spending")}
            </p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">
              {formatCurrency(totalSpending)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">{t("net_flow")}</p>
            <p
              className={`text-2xl font-bold ${
                netFlow >= 0
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              {formatCurrency(netFlow)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
