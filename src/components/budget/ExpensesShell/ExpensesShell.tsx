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
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-3">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold">{budget?.name}</h1>
        </div>

        {/* Budget Summary */}
        <BudgetSumaryCard
          spentAmount={spentExpensesAmount}
          currentAmount={budgetedExpensesAmount}
          expectedAmount={budget?.expected_amount || 0}
        />

        <div className="flex items-center justify-end">
          {/* <h2 className="text-s font-semibold">{t("budget_expenses")}</h2> */}
          <Button
            size="sm"
            variant="outline"
            className="shadow-none"
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
          onChange={(key, value) => setEditForm({ ...editForm, [key]: value })}
          disabledUpdate={isUpdateDisabled}
          disabledName={!!expenseToEdit?.template_id}
        />
      </div>
    </div>
  );
};
export default ExpensesShell;
