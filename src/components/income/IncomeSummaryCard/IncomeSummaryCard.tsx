"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/numbers";
import { TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface IncomeSummaryCardProps {
  totalIncomeThisMonth: number;
  transactions: Transaction[];
}

const IncomeSummaryCard = ({
  totalIncomeThisMonth,
  transactions,
}: IncomeSummaryCardProps) => {
  const t = useTranslations("income");
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          {t("this_months_income")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600">
          {formatCurrency(totalIncomeThisMonth)}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {
            transactions.filter((transaction) => {
              const transactionDate = new Date(transaction.transaction_date);
              const currentMonth = new Date().getMonth();
              const currentYear = new Date().getFullYear();
              return (
                transactionDate.getMonth() === currentMonth &&
                transactionDate.getFullYear() === currentYear
              );
            }).length
          }{" "}
          {t("income_entries_this_month")}
        </p>
      </CardContent>
    </Card>
  );
};

export default IncomeSummaryCard;
