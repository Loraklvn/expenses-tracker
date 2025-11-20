import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BudgetWithCurrent } from "@/types";
import { formatCurrency } from "@/utils/numbers";
import React, { ReactElement } from "react";

type BudgetCardContentProps = {
  budget: BudgetWithCurrent;
  progress: {
    spent: number;
    percentage: number;
  };
  t: (key: string) => string;
};
const BudgetCardContent = ({
  budget,
  progress,
  t,
}: BudgetCardContentProps): ReactElement => {
  return (
    <CardContent className="p-4">
      <div className="space-y-3">
        <div className="space-y-0.5 text-sm">
          <div className="flex justify-between">
            <span> {t("spent")}: </span>
            <strong>{formatCurrency(progress.spent)}</strong>
          </div>
          <div className="flex justify-between">
            <span> {t("budget")}: </span>
            <strong>{formatCurrency(budget.expected_amount)}</strong>
          </div>
        </div>

        <Progress
          value={Math.min(progress.percentage, 100)}
          className="h-3 bg-gray-200"
          indicatorClassName={
            progress.percentage > 100 ? "bg-red-500" : "bg-green-500"
          }
        />
        <div className="text-center text-sm justify-between">
          <span> {t("remaining")}: </span>
          <strong>
            {formatCurrency(budget.expected_amount - progress.spent)}
          </strong>
        </div>
      </div>
    </CardContent>
  );
};
export default BudgetCardContent;
