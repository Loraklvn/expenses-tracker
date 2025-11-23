"use client";

import ExpenseTemplateFormModal from "@/components/expenses/ExpenseTemplateFormModal";
import ExpensesTemplateList from "@/components/expenses/ExpensesTemplateList";

import { Button } from "@/components/ui/button";

import ConfirmationModal from "@/components/common/ConfirmationModal/ConfirmationModal";
import Searchbar from "@/components/common/Searchbar";
import useManageExpensesTemplate from "@/hooks/useManageExpensesTemplate";
import { cn } from "@/lib/utils";
import { ExpenseTemplate } from "@/types";
import { Plus } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");

  const groupedExpenses = expenseTemplates?.reduce((acc, expense) => {
    if (
      searchTerm &&
      !expense.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return acc;
    }
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
        "min-h-screen bg-gray-50 p-4s pb-20",
        isLoading && "opacity-50 pointer-events-none"
      )}
    >
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
        <h1 className="text-xl font-bold tracking-tight">{t("title")}</h1>
      </div>

      <div className="max-w-md mx-auto p-4">
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

          <Searchbar
            searchQuery={searchTerm}
            setSearchQuery={setSearchTerm}
            placeholder={t("search_placeholder")}
          />

          {/* Expenses List */}
          <ExpensesTemplateList
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
