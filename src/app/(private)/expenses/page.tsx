"use client";

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
import {
  archiveExpenseTemplateClient,
  fetchCategoriesClient,
  fetchExpensesTemplateClient,
  postExpenseTemplateClient,
} from "@/lib/supabase/request/client";
import { cn } from "@/lib/utils";
import { ExpenseTemplate } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArchiveIcon, ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ManageExpenses() {
  const { data: expenseTemplates = [], refetch: refetchExpenseTemplates } =
    useQuery({
      queryKey: ["expenseTemplates"],
      queryFn: fetchExpensesTemplateClient,
    });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoriesClient,
  });
  const { mutate: addExpenseTemplate, isPending: isAdding } = useMutation({
    mutationKey: ["addExpenseTemplate"],
    mutationFn: postExpenseTemplateClient,
    onSuccess: () => {
      toast.success("Expense template added successfully!");
      setNewExpense({ name: "", category: "", defaultAmount: "" });
      setShowAddExpense(false);
      refetchExpenseTemplates();
    },
    onError: (error) => {
      console.error("Error adding expense template:", error);
      toast.error("Failed to add expense template. Please try again.");
    },
  });

  const { mutate: archiveExpense, isPending: isArchiving } = useMutation({
    mutationKey: ["archiveExpense"],
    mutationFn: archiveExpenseTemplateClient,
    onSuccess: () => {
      toast.success("Expense archived successfully!");
      setExpenseToDelete(null);
      setShowDeleteConfirm(false);
      refetchExpenseTemplates();
    },
    onError: (error) => {
      console.error("Error archiving expense:", error);
      toast.error("Failed to archive expense. Please try again.");
    },
  });
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expenseToDelete, setExpenseToDelete] =
    useState<ExpenseTemplate | null>(null);
  const [newExpense, setNewExpense] = useState({
    name: "",
    category: "",
    defaultAmount: "",
  });

  const addExpense = () => {
    const newTemplate = {
      name: newExpense.name,
      category_id: Number(newExpense.category),
      default_amount: parseFloat(newExpense.defaultAmount),
    };
    addExpenseTemplate(newTemplate);
  };

  const confirmDelete = (expense: ExpenseTemplate) => {
    setExpenseToDelete(expense);
    setShowDeleteConfirm(true);
  };

  const deleteExpense = () => {
    if (!expenseToDelete) return;
    archiveExpense(expenseToDelete.id);
    setShowDeleteConfirm(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const groupedExpenses = expenseTemplates?.reduce((acc, expense) => {
    if (!acc[expense.category_id]) {
      acc[expense.category_id] = [];
    }
    acc[expense.category_id].push(expense);
    return acc;
  }, {} as Record<string, ExpenseTemplate[]>);

  return (
    <div
      className={cn(
        "min-h-screen bg-background p-4 pb-20",
        isArchiving && "opacity-50 pointer-events-none"
      )}
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Manage Expenses</h1>
        </div>

        <div className="space-y-6">
          {/* Add New Expense Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={() => setShowAddExpense(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Expense
          </Button>

          {/* Expenses List */}
          <div className="space-y-4">
            {Object.entries(groupedExpenses).map(([categoryId, expenses]) => (
              <div key={categoryId}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  {
                    categories.find((cat) => cat.id === Number(categoryId))
                      ?.name
                  }
                </h3>
                <div className="space-y-1">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between py-3 px-1 border-b border-border/50 last:border-b-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                          <div>
                            <p className="font-medium text-base">
                              {expense.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Default: {formatCurrency(expense.default_amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => confirmDelete(expense)}
                        className="ml-2 text-gray-500"
                      >
                        <ArchiveIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {expenseTemplates.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No expense templates yet
                </p>
                <Button onClick={() => setShowAddExpense(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Expense
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Add Expense Dialog */}
        <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
          <DialogContent
            className={cn(
              "sm:max-w-[425px]",
              isAdding && "opacity-50 pointer-events-none"
            )}
          >
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Create a new expense template for your budgets
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="expense-name">Expense Name</Label>
                <Input
                  id="expense-name"
                  placeholder="e.g., Car Insurance"
                  value={newExpense.name}
                  onChange={(e) =>
                    setNewExpense((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-category">Category</Label>
                <select
                  id="expense-category"
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-amount">Default Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="expense-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newExpense.defaultAmount}
                    onChange={(e) =>
                      setNewExpense((prev) => ({
                        ...prev,
                        defaultAmount: e.target.value,
                      }))
                    }
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={addExpense}
                disabled={
                  !newExpense.name ||
                  !newExpense.category ||
                  !newExpense.defaultAmount
                }
              >
                Add Expense
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
              <AlertDialogTitle>Delete Expense Template</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{expenseToDelete?.name}
                &quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteExpense}
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
