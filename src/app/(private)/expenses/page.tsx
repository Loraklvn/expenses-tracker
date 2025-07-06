"use client";

import ExpenseTemplateFormModal from "@/components/expenses/ExpenseTemplateFormModal";
import ExpensesTemplateList from "@/components/expenses/ExpensesTemplateList";

import { Button } from "@/components/ui/button";

import ConfirmationModal from "@/components/common/ConfirmationModal/ConfirmationModal";
import useManageExpensesTemplate from "@/hooks/useManageExpensesTemplate";
import { cn } from "@/lib/utils";
import { ExpenseTemplate } from "@/types";
import { ArrowLeft, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const emptyForm = {
  id: 0,
  name: "",
  category: "",
  defaultAmount: "",
};

export default function ManageExpenses() {
  const { expenseTemplates, categories, add, edit, archive, isLoading } =
    useManageExpensesTemplate();

  const t = useTranslations("manage_expenses");

  // UI state management
  const [formVisible, setFormVisible] = useState(false);
  const [archiveVisible, setArchiveVisible] = useState(false);
  const [expenseToArchive, setExpenseToArchive] =
    useState<ExpenseTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState(emptyForm);

  const groupedExpenses = expenseTemplates?.reduce((acc, expense) => {
    if (!acc[expense.category_id]) {
      acc[expense.category_id] = [];
    }
    acc[expense.category_id].push(expense);
    return acc;
  }, {} as Record<string, ExpenseTemplate[]>);

  // Handlers
  const addExpense = async () => {
    const newTemplate = {
      name: formValues.name,
      category_id: Number(formValues.category),
      default_amount: parseFloat(formValues.defaultAmount),
    };
    if (!isEditing) await add.mutateAsync(newTemplate);
    else
      await edit.mutateAsync({ templateId: formValues.id, args: newTemplate });

    setFormVisible(false);
    setIsEditing(false);
    setFormValues(emptyForm);
  };

  const onArchive = (expense: ExpenseTemplate) => {
    setExpenseToArchive(expense);
    setArchiveVisible(true);
  };

  const onConfirmArchive = async () => {
    if (!expenseToArchive) return;
    await archive.mutateAsync(expenseToArchive.id);
    setArchiveVisible(false);
    setExpenseToArchive(null);
  };

  const openEdit = (expense: ExpenseTemplate) => {
    setFormValues({
      id: expense.id,
      name: expense.name,
      category: String(expense.category_id),
      defaultAmount: String(expense.default_amount),
    });
    setIsEditing(true);
    setFormVisible(true);
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-background p-4 pb-20",
        isLoading && "opacity-50 pointer-events-none"
      )}
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
        </div>

        <div className="space-y-6">
          {/* Add New Expense Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={() => setFormVisible(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("add_new_expense")}
          </Button>

          {/* Expenses List */}
          <ExpensesTemplateList
            expenses={expenseTemplates}
            groupedExpenses={groupedExpenses}
            categories={categories}
            isEmpty={expenseTemplates.length === 0}
            onOpenEdit={openEdit}
            onArchive={onArchive}
            onAddExpense={() => setFormVisible(true)}
          />
        </div>

        {/* Add Expense Dialog */}
        <ExpenseTemplateFormModal
          isVisible={formVisible}
          isEditing={isEditing}
          expense={formValues}
          isLoading={isLoading}
          categories={categories}
          onClose={() => setFormVisible(false)}
          onAddExpense={addExpense}
          onChangeExpense={(field, value) =>
            setFormValues((prev) => ({ ...prev, [field]: value }))
          }
        />
        {/* Delete Confirmation Dialog */}

        <ConfirmationModal
          visible={archiveVisible}
          onClose={() => setArchiveVisible(false)}
          onConfirm={onConfirmArchive}
          title={t("archive_expense", {
            expenseName: expenseToArchive?.name || "",
          })}
          description={t("archive_expense_confirmation", {
            expenseName: expenseToArchive?.name || "",
          })}
          cancelButtonText={t("cancel")}
          confirmButtonText={t("archive")}
        />
      </div>
    </div>
  );
}
