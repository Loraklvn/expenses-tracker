"use client";

import { Button } from "@/components/ui/button";
import { fetchExpensesClient } from "@/lib/supabase/request/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactElement, useState } from "react";
import AddTransactionModal from "../AddTransactionModal";
import ExpensesList from "../ExpensesList/ExpensesList";
import { BudgetWithCurrent, ExpenseWithCurrent } from "@/types";

const ExpensesShell = ({
  budget,
  initialExpenses,
}: {
  budget: BudgetWithCurrent | null;
  initialExpenses: ExpenseWithCurrent[];
}): ReactElement => {
  const { data: expenses = [], refetch } = useQuery({
    queryKey: ["expenses", budget?.id],
    queryFn: async () => fetchExpensesClient(budget?.id || 0),
    initialData: initialExpenses,
    enabled: !!budget?.id,
  });

  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<ExpenseWithCurrent | null>(null);

  const handleCloseModal = () => {
    setShowAddTransaction(false);
    setSelectedExpense(null);
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
      </div>
    </div>
  );
};
export default ExpensesShell;
