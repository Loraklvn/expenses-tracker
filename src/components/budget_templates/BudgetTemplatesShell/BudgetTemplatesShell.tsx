"use client";

import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Button } from "@/components/ui/button";
import useManageBudgetTemplates from "@/hooks/useManageBudgetTemplates";
import { BudgetTemplateWithStats, Category, ExpenseTemplate } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import BudgetTemplateFormModal from "../BudgetTemplateFormModal/BudgetTemplateFormModal";
import BudgetTemplatesList from "../BudgetTemplatesList";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import StickyHeader from "@/components/common/StickyHeader";

interface BudgetTemplatesProps {
  defaultBudgetTemplates: BudgetTemplateWithStats[];
  expenseTemplates: ExpenseTemplate[];
  categories: Category[];
}
const emptyFormData = {
  name: "",
  description: "",
};
export default function BudgetTemplatesShell({
  defaultBudgetTemplates,
  expenseTemplates,
  categories,
}: BudgetTemplatesProps) {
  const t = useTranslations("budget_templates");
  const { budgetTemplates, add, update, remove } = useManageBudgetTemplates({
    defaultBudgetTemplates,
  });
  const [formVisibility, setFormVisibility] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [templateToEdit, setTemplateToEdit] =
    useState<BudgetTemplateWithStats | null>(null);
  const [templateToDelete, setTemplateToDelete] =
    useState<BudgetTemplateWithStats | null>(null);
  const [selectedExpenses, setSelectedExpenses] = useState<ExpenseTemplate[]>(
    []
  );
  const [formData, setFormData] = useState(emptyFormData);
  const router = useRouter();
  const resetForm = () => {
    setFormData(emptyFormData);
    setSelectedExpenses([]);
  };

  const toggleExpenseSelection = (expenseId: number) => {
    setSelectedExpenses((prev) => {
      const expense = prev.find((e) => e.id === expenseId);
      if (expense) {
        return prev.filter((e) => e.id !== expenseId);
      }
      return [...prev, expenseTemplates.find((e) => e.id === expenseId)!];
    });
  };
  const clearState = () => {
    resetForm();
    setFormVisibility(false);
    setIsEditing(false);
    setTemplateToEdit(null);
    setTemplateToDelete(null);
  };

  const createTemplate = async () => {
    await add.mutateAsync({
      name: formData.name.trim(),
      description: formData.description.trim(),
      expenseTemplateIds: selectedExpenses.map((e) => e.id),
    });
    clearState();
  };

  const editTemplate = async () => {
    if (!templateToEdit) return;

    await update.mutateAsync({
      name: formData.name.trim(),
      description: formData.description.trim(),
      templateId: templateToEdit.id,
      expenseTemplateIds: selectedExpenses.map((e) => e.id),
    });
    clearState();
  };

  const confirmDelete = (template: BudgetTemplateWithStats) => {
    setTemplateToDelete(template);
    setShowDeleteConfirm(true);
  };

  const deleteTemplate = async () => {
    if (!templateToDelete) return;

    await remove.mutateAsync(templateToDelete.id);
    clearState();
  };

  const openCreateDialog = () => {
    resetForm();
    setFormVisibility(true);
  };

  const openEditDialog = (template: BudgetTemplateWithStats) => {
    setIsEditing(true);
    setTemplateToEdit(template);
    setFormData({
      name: template.name,
      description: template.description ?? "",
    });

    // Pre-select expenses from the template
    setSelectedExpenses(
      expenseTemplates.filter((e) =>
        template.expense_template_ids.includes(e.id)
      )
    );
    setFormVisibility(true);
  };

  const applyTemplate = async (template: BudgetTemplateWithStats) => {
    router.push(`/new-budget?templateId=${template.id}`);
  };

  const handleOnSubmit = () => {
    if (isEditing) {
      editTemplate();
    } else {
      createTemplate();
    }
  };

  const groupedExpenses = expenseTemplates.reduce((acc, expense) => {
    if (!acc[expense.category_id]) {
      acc[expense.category_id] = [];
    }
    acc[expense.category_id].push(expense);
    return acc;
  }, {} as Record<string, ExpenseTemplate[]>);

  return (
    <div className="min-h-screen bg-gray-50  pb-20">
      <StickyHeader title={t("title")} />
      <div className="max-w-md mx-auto p-4">
        <div className="space-y-6">
          {/* Create Template Button */}
          <Button className="w-full" size="lg" onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            {t("create_template")}
          </Button>

          {/* Templates List */}
          <BudgetTemplatesList
            budgetTemplates={budgetTemplates}
            onEdit={openEditDialog}
            onApply={applyTemplate}
            onDelete={confirmDelete}
            onCreate={openCreateDialog}
          />

          {budgetTemplates.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              {t("templates_count", { count: budgetTemplates.length })}
            </div>
          )}
        </div>

        {/* Create Template Dialog */}
        <BudgetTemplateFormModal
          visible={formVisibility}
          onClose={() => setFormVisibility(false)}
          onSubmit={handleOnSubmit}
          formData={formData}
          onChange={(key, value) =>
            setFormData((prev) => ({ ...prev, [key]: value }))
          }
          groupedExpenses={groupedExpenses}
          selectedExpenses={selectedExpenses}
          toggleExpenseSelection={toggleExpenseSelection}
          categories={categories}
          isEditing={isEditing}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmationModal
          visible={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => deleteTemplate()}
          title={t("delete_template_title")}
          description={t("delete_template_description", {
            name: templateToDelete?.name ?? "",
          })}
          confirmButtonText={t("delete_template_confirm")}
          cancelButtonText={t("delete_template_cancel")}
        />
      </div>
    </div>
  );
}
