"use client";

import { useState } from "react";
import { Plus, Trash2, Edit, Copy, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetTemplateWithStats, Category, ExpenseTemplate } from "@/types";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createBudgetTemplateClient,
  deleteBudgetTemplateClient,
  fetchBudgetTemplatesClient,
  updateBudgetTemplateClient,
} from "@/lib/supabase/request/client";

interface BudgetTemplatesProps {
  expenseTemplates: ExpenseTemplate[];
  categories: Category[];
}

export default function BudgetTemplatesShell({
  expenseTemplates,
  categories,
}: BudgetTemplatesProps) {
  const { data: budgetTemplates = [], refetch } = useQuery({
    queryKey: ["budget-templates"],
    queryFn: fetchBudgetTemplatesClient,
  });
  const { mutate: createBudgetTemplate } = useMutation({
    mutationFn: createBudgetTemplateClient,
    onSuccess: () => {
      toast.success("Budget template created successfully");
      resetForm();
      setShowCreateTemplate(false);
      refetch();
    },
  });
  const { mutate: updateBudgetTemplate } = useMutation({
    mutationFn: updateBudgetTemplateClient,
    onSuccess: () => {
      toast.success("Budget template updated successfully");
      refetch();
      resetForm();
      setTemplateToEdit(null);
      setShowEditTemplate(false);
    },
  });
  const { mutate: deleteBudgetTemplate } = useMutation({
    mutationFn: deleteBudgetTemplateClient,
    onSuccess: () => {
      toast.success("Budget template deleted successfully");
      resetForm();
      setTemplateToDelete(null);
      setShowDeleteConfirm(false);
      refetch();
    },
  });
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showEditTemplate, setShowEditTemplate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [templateToEdit, setTemplateToEdit] =
    useState<BudgetTemplateWithStats | null>(null);
  const [templateToDelete, setTemplateToDelete] =
    useState<BudgetTemplateWithStats | null>(null);
  const [selectedExpenses, setSelectedExpenses] = useState<{
    [key: number]: { selected: boolean; amount: string };
  }>({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
  });

  const validateForm = () => {
    const errors = { name: "", description: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Template name is required";
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      errors.name = "Template name must be at least 3 characters";
      isValid = false;
    } else if (
      budgetTemplates.some(
        (template) =>
          template.name.toLowerCase() === formData.name.trim().toLowerCase() &&
          template.id !== templateToEdit?.id
      )
    ) {
      errors.name = "Template name already exists";
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setFormErrors({ name: "", description: "" });
    setSelectedExpenses({});
  };

  const toggleExpenseSelection = (expenseId: number) => {
    setSelectedExpenses((prev) => ({
      ...prev,
      [expenseId]: {
        selected: !prev[expenseId]?.selected,
        amount:
          prev[expenseId]?.amount ||
          expenseTemplates
            .find((e) => e.id === expenseId)
            ?.default_amount.toString() ||
          "",
      },
    }));
  };

  const updateExpenseAmount = (expenseId: number, amount: string) => {
    setSelectedExpenses((prev) => ({
      ...prev,
      [expenseId]: {
        ...prev[expenseId],
        amount,
      },
    }));
  };

  const getSelectedExpensesList = () => {
    return expenseTemplates.filter(
      (expense) => selectedExpenses[expense.id]?.selected
    );
  };

  const getTotalAmount = () => {
    return getSelectedExpensesList().reduce(
      (sum, expense) => sum + expense.default_amount,
      0
    );
  };

  const createTemplate = () => {
    if (!validateForm()) return;

    const selectedExpensesList = getSelectedExpensesList();
    if (selectedExpensesList.length === 0) {
      toast.error("No expenses selected");
      return;
    }

    createBudgetTemplate({
      name: formData.name.trim(),
      description: formData.description.trim(),
      expenseTemplateIds: selectedExpensesList.map((e) => e.id),
    });
  };

  const editTemplate = () => {
    if (!validateForm() || !templateToEdit) return;

    const selectedExpensesList = getSelectedExpensesList();
    if (selectedExpensesList.length === 0) {
      toast.error("No expenses selected");
      return;
    }

    updateBudgetTemplate({
      templateId: templateToEdit.id,
      expenseTemplateIds: selectedExpensesList.map((e) => e.id),
    });
  };

  const confirmDelete = (template: BudgetTemplateWithStats) => {
    setTemplateToDelete(template);
    setShowDeleteConfirm(true);
  };

  const deleteTemplate = () => {
    if (!templateToDelete) return;

    deleteBudgetTemplate(templateToDelete.id);
  };

  const openCreateDialog = () => {
    resetForm();
    setShowCreateTemplate(true);
  };

  const openEditDialog = (template: BudgetTemplateWithStats) => {
    setTemplateToEdit(template);
    setFormData({
      name: template.name,
      description: template.description ?? "",
    });

    // Pre-select expenses from the template
    setSelectedExpenses(
      template.expense_template_ids.reduce((acc, expenseId) => {
        acc[expenseId] = {
          selected: true,
          amount:
            expenseTemplates
              .find((e) => e.id === expenseId)
              ?.default_amount.toString() || "",
        };
        return acc;
      }, {} as { [key: number]: { selected: boolean; amount: string } })
    );
    setFormErrors({ name: "", description: "" });
    setShowEditTemplate(true);
  };

  const duplicateTemplate = (template: BudgetTemplateWithStats) => {
    createBudgetTemplate({
      name: template.name + " (Copy)",
      description: template.description,
      expenseTemplateIds: template.expense_template_ids,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
          <div className="space-y-4">
            {budgetTemplates.length > 0 ? (
              budgetTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {template.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {formatCurrency(template.total_default_amount)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created {formatDate(template.created_at)}</span>
                      <span>•</span>
                      <span>Used {template.expense_count} times</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">
                          {template.expense_count} expenses included
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(template)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => duplicateTemplate(template)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Duplicate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => confirmDelete(template)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No budget templates yet
                </p>
                <Button onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Template
                </Button>
              </div>
            )}
          </div>

          {budgetTemplates.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              {budgetTemplates.length} templates
            </div>
          )}
        </div>

        {/* Create Template Dialog */}
        <Dialog open={showCreateTemplate} onOpenChange={setShowCreateTemplate}>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Budget Template</DialogTitle>
              <DialogDescription>
                Create a reusable template with your preferred expenses
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name *</Label>
                <Input
                  id="template-name"
                  placeholder="e.g., Monthly Essentials"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={formErrors.name ? "border-destructive" : ""}
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-description">Description *</Label>
                <Textarea
                  id="template-description"
                  placeholder="e.g., Essential expenses for a typical month"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className={formErrors.description ? "border-destructive" : ""}
                />
                {formErrors.description && (
                  <p className="text-sm text-destructive">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Select Expenses</Label>
                {Object.entries(groupedExpenses).map(([category, expenses]) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                      {categories.find((c) => c.id === Number(category))?.name}
                    </h4>
                    <div className="space-y-1">
                      {expenses.map((expense) => {
                        const isSelected =
                          selectedExpenses[expense.id]?.selected || false;
                        const amount =
                          selectedExpenses[expense.id]?.amount ||
                          expense.default_amount.toString();

                        return (
                          <div
                            key={expense.id}
                            className={`flex items-center justify-between py-2 px-3 rounded-lg border transition-colors ${
                              isSelected
                                ? "bg-primary/5 border-primary/20"
                                : "bg-background border-border"
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <button
                                type="button"
                                onClick={() =>
                                  toggleExpenseSelection(expense.id)
                                }
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? "bg-primary border-primary"
                                    : "border-muted-foreground/30"
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-2 h-2 bg-white rounded-sm" />
                                )}
                              </button>
                              <span className="text-sm font-medium">
                                {expense.name}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="relative w-20">
                                <span className="absolute left-2 top-1.5 text-xs text-muted-foreground">
                                  $
                                </span>
                                <Input
                                  type="number"
                                  value={amount}
                                  onChange={(e) =>
                                    updateExpenseAmount(
                                      expense.id,
                                      e.target.value
                                    )
                                  }
                                  className="pl-6 h-7 text-xs"
                                  placeholder="0"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {getSelectedExpensesList().length > 0 && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {getSelectedExpensesList().length} expenses selected
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(getTotalAmount())}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateTemplate(false)}
              >
                Cancel
              </Button>
              <Button type="submit" onClick={createTemplate}>
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Template Dialog */}
        <Dialog open={showEditTemplate} onOpenChange={setShowEditTemplate}>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Budget Template</DialogTitle>
              <DialogDescription>Update your budget template</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-template-name">Template Name *</Label>
                <Input
                  id="edit-template-name"
                  placeholder="e.g., Monthly Essentials"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={formErrors.name ? "border-destructive" : ""}
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-template-description">Description *</Label>
                <Textarea
                  id="edit-template-description"
                  placeholder="e.g., Essential expenses for a typical month"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className={formErrors.description ? "border-destructive" : ""}
                />
                {formErrors.description && (
                  <p className="text-sm text-destructive">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Select Expenses grouped by expense</Label>
                {Object.entries(groupedExpenses).map(
                  ([category_id, expenses]) => (
                    <div key={category_id}>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        {
                          categories.find((c) => c.id === Number(category_id))
                            ?.name
                        }{" "}
                      </h4>
                      <div className="space-y-1">
                        {expenses.map((expense) => {
                          const isSelected =
                            selectedExpenses[expense.id]?.selected || false;
                          const amount =
                            selectedExpenses[expense.id]?.amount ||
                            expense.default_amount.toString();

                          return (
                            <div
                              key={expense.id}
                              className={`flex items-center justify-between py-2 px-3 rounded-lg border transition-colors ${
                                isSelected
                                  ? "bg-primary/5 border-primary/20"
                                  : "bg-background border-border"
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    toggleExpenseSelection(expense.id)
                                  }
                                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                    isSelected
                                      ? "bg-primary border-primary"
                                      : "border-muted-foreground/30"
                                  }`}
                                >
                                  {isSelected && (
                                    <div className="w-2 h-2 bg-white rounded-sm" />
                                  )}
                                </button>
                                <span className="text-sm font-medium">
                                  {expense.name}
                                </span>
                              </div>
                              {isSelected && (
                                <div className="relative w-20">
                                  <span className="absolute left-2 top-1.5 text-xs text-muted-foreground">
                                    $
                                  </span>
                                  <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) =>
                                      updateExpenseAmount(
                                        expense.id,
                                        e.target.value
                                      )
                                    }
                                    className="pl-6 h-7 text-xs"
                                    placeholder="0"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>

              {getSelectedExpensesList().length > 0 && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {getSelectedExpensesList().length} expenses selected
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(getTotalAmount())}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditTemplate(false)}
              >
                Cancel
              </Button>
              <Button type="submit" onClick={editTemplate}>
                Update Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Budget Template</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{templateToDelete?.name}
                &quot;?
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <p className="font-medium">{templateToDelete?.name}</p>
                  <p className="text-muted-foreground">
                    {templateToDelete?.description}
                  </p>
                  <p className="text-muted-foreground">
                    {templateToDelete?.expense_count} expenses •{" "}
                    {formatCurrency(
                      templateToDelete?.total_default_amount || 0
                    )}
                  </p>
                </div>
                <span className="block mt-2">
                  This action cannot be undone.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteTemplate}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
