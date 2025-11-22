"use client";

import ConfirmationModal from "@/components/common/ConfirmationModal";
import Searchbar from "@/components/common/Searchbar";
import { Button } from "@/components/ui/button";
import {
  deleteBudgetExpenseClient,
  fetchExpensesClient,
  updateBudgetExpenseClient,
} from "@/lib/supabase/request/client";
import { BudgetWithCurrent, ExpenseWithCurrent } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ReactElement, useState } from "react";
import { toast } from "react-toastify";
import AddExpenseToBudgetModal from "../AddExpenseToBudgetModal/AddExpenseToBudgetModal";
import AddTransactionModal from "../AddTransactionModal";
import BudgetSumaryCard from "../BudgetSumaryCard/BudgetSumaryCard";
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
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredExpenses = expenses.filter((expense) =>
    expense.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg hover:bg-accent transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold tracking-tight">{budget?.name}</h1>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Budget Summary */}
          <BudgetSumaryCard
            spentAmount={spentExpensesAmount}
            currentAmount={budgetedExpensesAmount}
            expectedAmount={budget?.expected_amount || 0}
          />

          <div className="flex items-center justify-end">
            <Button
              size="default"
              className="rounded-xl h-11 px-6 font-semibold shadow-sm"
              onClick={() => setShowAddExpenseToBudget(true)}
            >
              {t("add_expense")}
            </Button>
          </div>

          <Searchbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={t("search_placeholder")}
          />

          <ExpensesList
            expenses={filteredExpenses}
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
            onChange={(key, value) =>
              setEditForm({ ...editForm, [key]: value })
            }
            disabledUpdate={isUpdateDisabled}
            disabledName={!!expenseToEdit?.template_id}
          />
        </div>
      </div>
    </div>
  );
};
export default ExpensesShell;
