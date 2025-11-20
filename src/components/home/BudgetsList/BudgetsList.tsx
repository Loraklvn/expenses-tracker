"use client";

import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Button } from "@/components/ui/button";
import useManageBudgets from "@/hooks/useManageBudgets";
import { BudgetWithCurrent } from "@/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ReactElement, useState } from "react";
import BudgetCard from "../BudgetCard";

const BudgetsList = ({
  budgets: defaultBudgets,
}: {
  budgets: BudgetWithCurrent[];
}): ReactElement => {
  const t = useTranslations("budget_list");
  const { budgets, remove } = useManageBudgets({ defaultBudgets });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [budgetToDelete, setBudgetToDelete] =
    useState<BudgetWithCurrent | null>(null);

  // Sort budgets by date in descending order (newest first)
  const sortedBudgets = [...budgets].sort((a, b) => {
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
  });

  const getBudgetProgress = (budget: BudgetWithCurrent) => {
    const totalSpent = budget.current_amount;
    return {
      spent: totalSpent,
      percentage: (totalSpent / budget.expected_amount) * 100,
    };
  };

  const confirmDelete = (budget: BudgetWithCurrent) => {
    setBudgetToDelete(budget);
    setShowDeleteConfirm(true);
  };

  const deleteBudget = async () => {
    if (!budgetToDelete) return;
    await remove.mutateAsync(budgetToDelete.id);
    setShowDeleteConfirm(false);
    setBudgetToDelete(null);
  };

  if (!budgets || budgets.length === 0) {
    return (
      <div>
        <div className="space-y-6 text-center pt-[200px]">
          <p>{t("no_budgets")}</p>

          <Link href="/select-template" className="block">
            <Button>{t("add_your_first_budget")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {sortedBudgets.map((budget) => {
          const progress = getBudgetProgress(budget);
          return (
            <BudgetCard
              key={budget.id}
              budget={budget}
              progress={progress}
              onDelete={confirmDelete}
            />
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={deleteBudget}
        title={t("delete_budget")}
        description={t("delete_budget_confirmation")}
        confirmButtonText={t("delete")}
        cancelButtonText={t("cancel")}
      />
    </div>
  );
};
export default BudgetsList;
