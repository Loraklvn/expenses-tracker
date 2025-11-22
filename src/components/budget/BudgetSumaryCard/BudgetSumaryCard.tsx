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
  const percentage = Math.round((spentAmount / (expectedAmount || 1)) * 100);
  const isOverBudget = spentAmount > (expectedAmount || 0);
  const isWarning = spentAmount > (expectedAmount || 0) * 0.8;

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            {t("spent")}
          </span>
          <span
            className={cn(
              "text-2xl font-bold",
              isOverBudget
                ? "text-red-600"
                : isWarning
                ? "text-yellow-600"
                : "text-green-600"
            )}
          >
            {formatCurrency(spentAmount)}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            {t("budget")}
          </span>
          <span className="text-2xl font-bold text-foreground">
            {formatCurrency(expectedAmount)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-3 mb-3">
        <Progress
          value={Math.min(percentage, 100)}
          className="h-2.5 flex-1"
          indicatorClassName={
            isOverBudget
              ? "bg-red-500"
              : isWarning
              ? "bg-yellow-500"
              : "bg-green-500"
          }
        />
        <div className="bg-muted text-xs font-semibold rounded-full h-9 w-9 flex items-center justify-center flex-shrink-0">
          {percentage}%
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <span
          className={cn(
            "text-sm font-semibold",
            isOverBudget
              ? "text-red-600"
              : isWarning
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
