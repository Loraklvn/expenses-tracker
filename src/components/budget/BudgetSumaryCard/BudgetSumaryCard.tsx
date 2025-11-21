import React, { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/utils/numbers";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type BudgetSumaryCardProps = {
  spentAmount: number;
  currentAmount: number;
  expectedAmount: number;
};

const BudgetSumaryCard = ({
  spentAmount,
  currentAmount,
  expectedAmount,
}: BudgetSumaryCardProps): ReactElement => {
  const t = useTranslations("expenses");
  return (
    <div className="bg-card border rounded-lg p-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col ">
          <span className="text-sm text-muted-foreground">{t("spent")}: </span>
          <span
            className={cn(
              "text-sm font-semibold",
              spentAmount > (expectedAmount || 0)
                ? "text-red-600"
                : spentAmount > (expectedAmount || 0) * 0.8
                ? "text-yellow-600"
                : "text-green-600"
            )}
          >
            {formatCurrency(spentAmount)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">{t("budget")}: </span>
          <span className="text-sm font-semibold text-gray-700">
            {formatCurrency(expectedAmount)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-2 flex items-center gap-2">
        <Progress
          value={Math.min((spentAmount / (expectedAmount || 1)) * 100, 100)}
          className="h-2 mb-2 flex-1"
          indicatorClassName={
            spentAmount > (expectedAmount || 0)
              ? "bg-red-500"
              : spentAmount > (expectedAmount || 0) * 0.8
              ? "bg-yellow-500"
              : "bg-green-500"
          }
        />
        <div className="bg-gray-200 text-xs rounded-full h-8 w-8 flex items-center justify-center">
          {Math.round((spentAmount / (expectedAmount || 1)) * 100)}%
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between">
        <span
          className={cn(
            "text-xs font-semibold",
            spentAmount > (expectedAmount || 0)
              ? "text-red-600"
              : spentAmount > (expectedAmount || 0) * 0.8
              ? "text-yellow-600"
              : "text-green-600"
          )}
        >
          {expectedAmount - spentAmount >= 0 ? "+" : ""}
          {formatCurrency(expectedAmount - spentAmount)} {t("available")}
        </span>
        <span className="text-xs text-muted-foreground">
          {t("budgeted")}: {formatCurrency(currentAmount)}
        </span>
      </div>
    </div>
  );
};
export default BudgetSumaryCard;
