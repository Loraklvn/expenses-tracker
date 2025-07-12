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
