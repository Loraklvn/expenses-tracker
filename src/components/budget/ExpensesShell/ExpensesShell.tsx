"use client";

import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Button } from "@/components/ui/button";
import {
  deleteBudgetExpenseClient,
  fetchExpensesClient,
  updateBudgetExpenseClient,
} from "@/lib/supabase/request/client";
import { BudgetWithCurrent, ExpenseWithCurrent } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ReactElement, useState } from "react";
import { toast } from "react-toastify";
import AddExpenseToBudgetModal from "../AddExpenseToBudgetModal/AddExpenseToBudgetModal";
import AddTransactionModal from "../AddTransactionModal";
import EditBudgetExpenseFormModal from "../EditBudgetExpenseFormModal";
import ExpensesList from "../ExpensesList/ExpensesList";

const emptyFormData = {
  name: "",
  description: "",
  amount: "",
};

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
  const budgetedExpensesAmount = expenses.reduce(
    (acc, expense) => acc + expense.budgeted_amount,
    0
  );
  const spentExpensesAmount = expenses.reduce(
    (acc, expense) => acc + expense.current_amount,
    0
  );

  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<ExpenseWithCurrent | null>(null);
  const [showAddExpenseToBudget, setShowAddExpenseToBudget] = useState(false);
  const [showEditExpense, setShowEditExpense] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<ExpenseWithCurrent | null>(
    null
  );
  const [editForm, setEditForm] = useState(emptyFormData);

  const isUpdateDisabled =
    !editForm.amount ||
    !editForm.name ||
    (editForm.name === expenseToEdit?.name &&
      editForm.amount === expenseToEdit?.budgeted_amount.toString());

  const handleCloseModal = () => {
    setShowAddTransaction(false);
    setSelectedExpense(null);
  };

  const handleCloseAddExpenseToBudget = () => {
    setShowAddExpenseToBudget(false);
  };

  const handleEditExpense = (expense: ExpenseWithCurrent) => {
    setExpenseToEdit(expense);
    setEditForm({
      name: expense.name,
      description: expense.description || "",
      amount: expense.budgeted_amount.toString(),
    });
    setShowEditExpense(true);
  };

  const handleDeleteConfirmation = (expense: ExpenseWithCurrent) => {
    setShowDeleteConfirmation(true);
    setSelectedExpense(expense);
  };
  const handleCloseEditModal = () => {
    setShowEditExpense(false);
    setExpenseToEdit(null);
    setEditForm(emptyFormData);
  };

  const handleEditConfirm = async () => {
    try {
      const updates = {
        expenseId: expenseToEdit?.id || 0,
        name: editForm.name || undefined,
        description: editForm.description || undefined,
        amount: Number(editForm.amount),
      };

      if (expenseToEdit?.template_id) delete updates.name;

      await updateBudgetExpenseClient(updates);
      refetch();
      handleCloseEditModal();
    } catch (err) {
      console.log({ err });
      toast.error(t("error_updating_expense"));
    }
  };

  const handleDeleteExpense = async () => {
    try {
      await deleteBudgetExpenseClient(selectedExpense?.id || 0);
      refetch();
      setShowDeleteConfirmation(false);
      setSelectedExpense(null);
    } catch (err) {
      console.log({ err });
      toast.error(t("error_deleting_expense"));
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold">{budget?.name}</h1>
        </div>

        {/* Budget Summary */}
        <div className="bg-card border rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-muted-foreground">
                  {t("spent")}:{" "}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    spentExpensesAmount > (budget?.expected_amount || 0)
                      ? "text-red-600"
                      : spentExpensesAmount >
                        (budget?.expected_amount || 0) * 0.8
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  ${spentExpensesAmount.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  {t("budget")}:{" "}
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  ${(budget?.expected_amount || 0).toFixed(2)}
                </span>
              </div>
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                spentExpensesAmount > (budget?.expected_amount || 0)
                  ? "bg-red-100 text-red-800"
                  : spentExpensesAmount > (budget?.expected_amount || 0) * 0.8
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {Math.round(
                (spentExpensesAmount / (budget?.expected_amount || 1)) * 100
              )}
              %
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full ${
                spentExpensesAmount > (budget?.expected_amount || 0)
                  ? "bg-red-500"
                  : spentExpensesAmount > (budget?.expected_amount || 0) * 0.8
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{
                width: `${Math.min(
                  (spentExpensesAmount / (budget?.expected_amount || 1)) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <span
              className={`text-xs ${
                (budget?.expected_amount || 0) - spentExpensesAmount >= 0
                  ? "text-gray-600"
                  : "text-red-600"
              }`}
            >
              {(budget?.expected_amount || 0) - spentExpensesAmount >= 0
                ? "+"
                : ""}
              $
              {((budget?.expected_amount || 0) - spentExpensesAmount).toFixed(
                2
              )}{" "}
              {t("available")}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("budgeted")}: ${budgetedExpensesAmount.toFixed(2)}
            </span>
          </div>
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
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteConfirmation}
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

        <ConfirmationModal
          visible={showDeleteConfirmation}
          onClose={() => setShowDeleteConfirmation(false)}
          onConfirm={handleDeleteExpense}
          title={t("delete_expense")}
          description={t("delete_expense_description")}
          confirmButtonText={t("delete")}
          cancelButtonText={t("cancel")}
        />

        {/* Edit Expense Modal */}
        <EditBudgetExpenseFormModal
          visible={showEditExpense}
          onClose={handleCloseEditModal}
          onSubmit={handleEditConfirm}
          formData={editForm}
          onChange={(key, value) => setEditForm({ ...editForm, [key]: value })}
          disabledUpdate={isUpdateDisabled}
          disabledName={!!expenseToEdit?.template_id}
        />
      </div>
    </div>
  );
};
export default ExpensesShell;
