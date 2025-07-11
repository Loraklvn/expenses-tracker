"use client";

import { Button } from "@/components/ui/button";
import { fetchExpensesClient } from "@/lib/supabase/request/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, PlusIcon } from "lucide-react";
import Link from "next/link";
import { ReactElement, useState } from "react";
import AddTransactionModal from "../AddTransactionModal";
import ExpensesList from "../ExpensesList/ExpensesList";
import { BudgetWithCurrent, ExpenseWithCurrent } from "@/types";
import { useTranslations } from "next-intl";
import AddExpenseToBudgetModal from "../AddExpenseToBudgetModal/AddExpenseToBudgetModal";

const ExpensesShell = ({
  budget,
  initialExpenses,
}: {
  budget: BudgetWithCurrent | null;
  initialExpenses: ExpenseWithCurrent[];
}): ReactElement => {
  const t = useTranslations("expenses");

  const { data: expenses = [], refetch } = useQuery({
    queryKey: ["expenses", budget?.id],
    queryFn: async () => fetchExpensesClient(budget?.id || 0),
    initialData: initialExpenses,
    enabled: !!budget?.id,
  });

  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<ExpenseWithCurrent | null>(null);
  const [showAddExpenseToBudget, setShowAddExpenseToBudget] = useState(false);
  const handleCloseModal = () => {
    setShowAddTransaction(false);
    setSelectedExpense(null);
  };
  const handleCloseAddExpenseToBudget = () => {
    setShowAddExpenseToBudget(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{budget?.name}</h1>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{t("budget_expenses")}</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAddExpenseToBudget(true)}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            {t("add_expense")}
          </Button>
        </div>

        <ExpensesList
          expenses={expenses}
          onAddTransaction={(expense) => {
            setSelectedExpense(expense);
            setShowAddTransaction(true);
          }}
        />

        <AddTransactionModal
          visible={showAddTransaction}
          onClose={handleCloseModal}
          selectedExpense={selectedExpense}
          refetch={refetch}
        />

        <AddExpenseToBudgetModal
          visible={showAddExpenseToBudget}
          onClose={handleCloseAddExpenseToBudget}
          expenses={expenses}
          budgetId={budget?.id || 0}
          onSuccess={() => {
            setShowAddExpenseToBudget(false);
            refetch();
          }}
        />
      </div>
    </div>
  );
};
export default ExpensesShell;
