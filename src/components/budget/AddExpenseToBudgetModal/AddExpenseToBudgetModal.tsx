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
import {
  addCustomExpenseToBudgetClient,
  addExpenseToBudgetClient,
  fetchCategoriesClient,
  fetchExpensesTemplateClient,
} from "@/lib/supabase/request/client";
import { cn } from "@/lib/utils";
import { ExpenseTemplate, ExpenseWithCurrent } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import TemplateExpenseSelection from "../TemplateExpenseSelection/TemplateExpenseSelection";
import UniqueExpenseTobudget from "../UniqueExpenseTobudget/UniqueExpenseTobudget";

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
  const t = useTranslations("budget_list");
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
          <DialogTitle>{t("add_expense_to_budget")}</DialogTitle>
          <DialogDescription>
            {t("add_expense_to_budget_description")}
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
              {t("template_expense")}
            </Button>
            <Button
              variant={expenseType === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => setExpenseType("custom")}
              className="flex-1"
            >
              {t("custom_expense")}
            </Button>
          </div>

          {/* Template Expense Selection */}
          {expenseType === "template" && (
            <TemplateExpenseSelection
              unusedTemplateExpenses={unusedTemplateExpenses}
              selectedTemplateExpense={selectedTemplateExpense}
              setSelectedTemplateExpense={setSelectedTemplateExpense}
              categories={categories}
            />
          )}

          {/* Custom Expense Form */}
          {expenseType === "custom" && (
            <UniqueExpenseTobudget
              customExpenseForm={customExpenseForm}
              onChange={(field, value) =>
                setCustomExpenseForm((prev) => ({
                  ...prev,
                  [field]: value,
                }))
              }
              categories={categories}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
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
            {t("add_expense")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddExpenseToBudgetModal;
