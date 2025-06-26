import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BudgetWithCurrent } from "@/types";
import { formatCurrency } from "@/utils/numbers";
import { Calendar, DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { ReactElement } from "react";

const BudgetsList = ({
  budgets,
}: {
  budgets: BudgetWithCurrent[];
}): ReactElement => {
  const t = useTranslations("budget_list");

  const getBudgetProgress = (budget: BudgetWithCurrent) => {
    const totalSpent = budget.current_amount;
    return {
      spent: totalSpent,
      percentage: (totalSpent / budget.expected_amount) * 100,
    };
  };

  if (!budgets || budgets.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 pb-20">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">{t("title")}</h1>
          </div>

          <div className="space-y-6 text-center pt-[200px]">
            <p>{t("no_budgets")}</p>

            <Link href="/new-budget" className="block">
              <Button>{t("add_your_first_budget")}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">{t("title")}</h1>
        </div>

        <div className="space-y-4">
          {budgets.map((budget) => {
            const progress = getBudgetProgress(budget);
            return (
              <Link
                href={`/budget/${budget.id}`}
                key={budget.id}
                className="block"
              >
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{budget.name}</CardTitle>
                      <Badge
                        variant={
                          progress.percentage > 100
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {progress.percentage.toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(budget.start_date).toLocaleDateString()} -{" "}
                        {new Date(budget.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>
                          {t("spent")}: {formatCurrency(progress.spent)}
                        </span>
                        <span>
                          {t("budget")}:{" "}
                          {formatCurrency(budget.expected_amount)}
                        </span>
                      </div>
                      <Progress
                        value={Math.min(progress.percentage, 100)}
                        className="h-2"
                      />
                      <div className="text-xs text-muted-foreground text-center">
                        {formatCurrency(
                          budget.expected_amount - progress.spent
                        )}{" "}
                        {t("remaining")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default BudgetsList;
