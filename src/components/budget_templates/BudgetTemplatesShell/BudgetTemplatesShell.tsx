"use client";

import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Button } from "@/components/ui/button";
import useManageBudgetTemplates from "@/hooks/useManageBudgetTemplates";
import { BudgetTemplateWithStats, Category, ExpenseTemplate } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import BudgetTemplateFormModal from "../BudgetTemplateFormModal/BudgetTemplateFormModal";
import BudgetTemplatesList from "../BudgetTemplatesList";

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

  const duplicateTemplate = async (template: BudgetTemplateWithStats) => {
    await add.mutateAsync({
      name: template.name + " (Copy)",
      description: template.description,
      expenseTemplateIds: template.expense_template_ids,
    });
    clearState();
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
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Budget Templates</h1>
        </div>

        <div className="space-y-6">
          {/* Create Template Button */}
          <Button className="w-full" size="lg" onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Template
          </Button>

          {/* Templates List */}
          <BudgetTemplatesList
            budgetTemplates={budgetTemplates}
            onEdit={openEditDialog}
            onDuplicate={duplicateTemplate}
            onDelete={confirmDelete}
            onCreate={openCreateDialog}
          />

          {budgetTemplates.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              {budgetTemplates.length} templates
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
          title="Delete Budget Template"
          description={`Are you sure you want to delete "${templateToDelete?.name}"? This action cannot be undone.`}
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
        />
      </div>
    </div>
  );
}
