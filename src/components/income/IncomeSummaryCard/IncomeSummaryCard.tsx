"use client";
import { formatCurrency } from "@/utils/numbers";
import { TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface IncomeSummaryCardProps {
  totalIncomeThisMonth: number;
}

const IncomeSummaryCard = ({
  totalIncomeThisMonth,
}: IncomeSummaryCardProps) => {
  const t = useTranslations("income");

  return (
    <div className="rounded-xl bg-card border border-green-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-5 w-5 text-green-600" />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-green-600">
          {t("this_months_income")}
        </h3>
      </div>
      <div className="text-3xl font-bold text-foreground mb-2">
        {formatCurrency(totalIncomeThisMonth)}
      </div>
    </div>
  );
};

export default IncomeSummaryCard;
