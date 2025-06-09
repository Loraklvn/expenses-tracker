"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Budget, Expense, Transaction } from "@/types";
import { formatCurrency } from "@/utils/numbers";
import { ArrowLeft, DollarSign, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactElement, useState } from "react";

const ExpensesList = ({
  setCurrentView,
  getBudgetExpenses,
  getCurrentSpent,
  transactions,
  setTransactions,
  selectedBudget,
}: {
  setCurrentView: (view: "budgets" | "expenses") => void;
  getBudgetExpenses: (budgetId: number) => Expense[];
  getCurrentSpent: (expenseId: number) => number;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  selectedBudget?: Budget | null;
}): ReactElement => {
  const t = useTranslations("expenses");

  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [transactionAmount, setTransactionAmount] = useState("");

  const handleAddTransaction = () => {
    if (!selectedExpense || !transactionAmount) return;

    const newTransaction: Transaction = {
      id: transactions.length + 1,
      description: `Transaction for ${selectedExpense.name}`,
      amount: Number.parseFloat(transactionAmount),
      type: "expense",
      transaction_date: new Date().toISOString().split("T")[0],
      expense_id: selectedExpense.id,
    };

    setTransactions([...transactions, newTransaction]);
    setTransactionAmount("");
    setShowAddTransaction(false);
    setSelectedExpense(null);
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("budgets")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{selectedBudget?.name}</h1>
        </div>

        <div className="space-y-1">
          {getBudgetExpenses(selectedBudget?.id || 0).map((expense) => {
            const currentSpent = getCurrentSpent(expense.id);

            return (
              <div
                key={expense.id}
                className="flex items-center justify-between py-3 px-1 border-b border-border/50 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    <div>
                      <p className="font-medium text-base">{expense.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(currentSpent)} /{" "}
                        {formatCurrency(expense.budgeted_amount)}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedExpense(expense);
                    setShowAddTransaction(true);
                  }}
                  className="ml-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>

        <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t("add_transaction")}</DialogTitle>
              <DialogDescription>
                {t("add_new_transaction_to", {
                  expenseName: selectedExpense?.name || "Expense",
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">{t("amount")}</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleAddTransaction}
                disabled={!transactionAmount}
              >
                {t("add_transaction")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default ExpensesList;
