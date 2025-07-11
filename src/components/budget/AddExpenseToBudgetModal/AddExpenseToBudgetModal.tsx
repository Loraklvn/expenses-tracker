"use client";

import { ReactElement, useMemo, useState } from "react";

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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addCustomExpenseToBudgetClient,
  addExpenseToBudgetClient,
  fetchCategoriesClient,
  fetchExpensesTemplateClient,
} from "@/lib/supabase/request/client";
import { cn } from "@/lib/utils";
import { ExpenseTemplate, ExpenseWithCurrent } from "@/types";
import { formatCurrency } from "@/utils/numbers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";

type AddExpenseToBudgetModalProps = {
  visible: boolean;
  onClose: () => void;
  expenses: ExpenseWithCurrent[];
  budgetId: number;
  onSuccess: () => void;
};

const AddExpenseToBudgetModal = ({
  visible,
  onClose,
  expenses,
  budgetId,
  onSuccess,
}: AddExpenseToBudgetModalProps): ReactElement => {
  const { data: expenseTemplates = [] } = useQuery({
    queryKey: ["expenseTemplates"],
    queryFn: () => fetchExpensesTemplateClient(),
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategoriesClient(),
  });
  const {
    mutate: addTemplateExpenseToBudget,
    isPending: isAddingTemplateExpense,
  } = useMutation({
    mutationFn: addExpenseToBudgetClient,
    onSuccess: onSuccess,
  });
  const { mutate: addCustomExpenseToBudget, isPending: isAddingCustomExpense } =
    useMutation({
      mutationFn: addCustomExpenseToBudgetClient,
      onSuccess: onSuccess,
    });

  const unusedTemplateExpenses = useMemo(() => {
    return expenseTemplates.filter(
      (template) =>
        !expenses.some((expense) => expense.template_id === template.id)
    );
  }, [expenseTemplates, expenses]);

  const [selectedTemplateExpense, setSelectedTemplateExpense] =
    useState<ExpenseTemplate | null>(null);
  const [customExpenseForm, setCustomExpenseForm] = useState<{
    name: string;
    category: string;
    amount: string;
  }>({ name: "", category: "", amount: "" });

  const [expenseType, setExpenseType] = useState<"template" | "custom">(
    "custom"
  );

  const handleAddExpense = () => {
    if (expenseType === "template") {
      addTemplateExpenseToBudget({
        expenseTemplate: selectedTemplateExpense!,
        budgetId,
      });
    } else {
      addCustomExpenseToBudget({
        name: customExpenseForm.name,
        categoryId: Number(customExpenseForm.category),
        amount: Number(customExpenseForm.amount),
        budgetId,
      });
    }
  };
  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[500px] max-h-[80vh] overflow-y-auto",
          (isAddingTemplateExpense || isAddingCustomExpense) &&
            "opacity-50 pointer-events-none"
        )}
      >
        <DialogHeader>
          <DialogTitle>Add Expense to Budget</DialogTitle>
          <DialogDescription>
            Add a template expense or create a custom expense for this budget
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Expense Type Selector */}
          <div className="flex gap-2">
            <Button
              variant={expenseType === "template" ? "default" : "outline"}
              size="sm"
              onClick={() => setExpenseType("template")}
              className="flex-1"
            >
              Template Expense
            </Button>
            <Button
              variant={expenseType === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => setExpenseType("custom")}
              className="flex-1"
            >
              Custom Expense
            </Button>
          </div>

          {/* Template Expense Selection */}
          {expenseType === "template" && (
            <div className="space-y-3">
              <Label>Select from available templates:</Label>
              {unusedTemplateExpenses.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {unusedTemplateExpenses.map((template) => (
                    <div
                      key={template.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTemplateExpense?.id === template.id
                          ? "bg-primary/5 border-primary/20"
                          : "bg-background border-border hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedTemplateExpense(template)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedTemplateExpense?.id === template.id
                              ? "bg-primary border-primary"
                              : "border-muted-foreground/30"
                          }`}
                        >
                          {selectedTemplateExpense?.id === template.id && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {
                              categories.find(
                                (category) =>
                                  category.id === template.category_id
                              )?.name
                            }
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">
                        {formatCurrency(template.default_amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>All template expenses have been added to this budget</p>
                </div>
              )}
            </div>
          )}

          {/* Custom Expense Form */}
          {expenseType === "custom" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-expense-name">Expense Name *</Label>
                <Input
                  id="custom-expense-name"
                  placeholder="e.g., Car Insurance"
                  value={customExpenseForm.name}
                  onChange={(e) =>
                    setCustomExpenseForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Select
                  value={customExpenseForm.category}
                  onValueChange={(value) =>
                    setCustomExpenseForm((prev) => ({
                      ...prev,
                      category: value,
                    }))
                  }
                >
                  <Label htmlFor="custom-expense-category">Category *</Label>

                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Category</SelectLabel>

                      {categories.map((category) => (
                        <SelectItem key={category.id} value={`${category.id}`}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-expense-amount">Budgeted Amount *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="custom-expense-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={customExpenseForm.amount}
                    onChange={(e) =>
                      setCustomExpenseForm((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddExpense}
            disabled={
              expenseType === "template"
                ? !selectedTemplateExpense
                : !customExpenseForm.name ||
                  !customExpenseForm.amount ||
                  !customExpenseForm.category
            }
          >
            Add Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddExpenseToBudgetModal;
