"use client";

import BudgetDetailsForm from "@/components/new-budget/BudgetDetailsForm";
import CustomExpenses from "@/components/new-budget/CustomExpenses";
import NewBudgetHeader from "@/components/new-budget/NewBudgetHeader";
import PreloadedExpenses from "@/components/new-budget/PreloadedExpenses";
import { Button } from "@/components/ui/button";
import { createBudgetWithLinesClient } from "@/lib/supabase/request/client";
import { cn } from "@/lib/utils";
import {
  BudgetTemplateWithStats,
  Category,
  CustomExpense,
  ExpenseTemplate,
  PreloadedExpenseTemplate,
} from "@/types";
import { genId } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { FileIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/dist/client/components/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type NewBudgetShellProps = {
  defaultExpensesTemplate: ExpenseTemplate[];
  categories: Category[];
  budgetTemplate?: BudgetTemplateWithStats;
};

export default function NewBudgetShell({
  defaultExpensesTemplate,
  categories,
  budgetTemplate,
}: NewBudgetShellProps) {
  const t = useTranslations("new_budget");
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: createBudgetWithLinesClient,
    onSuccess: (newId) => {
      router.push(`/budget/${newId}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error(t("failed_to_create_budget"));
    },
  });

  // Initialize the state for new budget details
  const [newBudgetName, setNewBudgetName] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");

  // Initialize the state for preloaded expense templates
  const [expenseTemplates, setSelectedExpenseTemplates] = useState<
    PreloadedExpenseTemplate[]
  >([]);

  // Initialize the state for custom expenses
  const [customExpenses, setCustomExpenses] = useState<
    { id: string; name: string; amount: string; category: string }[]
  >([]);

  // Set the default selected expense templates when the component mounts
  useEffect(() => {
    if (!defaultExpensesTemplate) return;
    const templates = defaultExpensesTemplate.map((template) => ({
      ...template,
      selected:
        budgetTemplate?.expense_template_ids.includes(template.id) ?? false, // Default to selected
      amount: template.default_amount.toString(), // Use default amount as string
    }));
    setSelectedExpenseTemplates(templates);
  }, [defaultExpensesTemplate, budgetTemplate]);

  const toggleExpenseTemplate = (templateId: number) => {
    setSelectedExpenseTemplates((prev) => {
      const updatedTemplates = prev.map((template) =>
        template.id === templateId
          ? { ...template, selected: !template.selected }
          : template
      );
      return updatedTemplates;
    });
  };

  //  Update the amount for a specific expense template
  const updateExpenseTemplateAmount = (templateId: number, amount: string) => {
    setSelectedExpenseTemplates((prev) => {
      const updatedTemplates = prev.map((template) =>
        template.id === templateId ? { ...template, amount } : template
      );
      return updatedTemplates;
    });
  };

  // Function to add a new custom expense
  const addCustomExpense = () => {
    setCustomExpenses((prev) => [
      ...prev,
      { id: genId(), name: "", amount: "", category: "" },
    ]);
  };

  // Function to update a custom expense
  const updateCustomExpense = (
    id: string,
    field: keyof CustomExpense,
    value: string | number
  ) => {
    setCustomExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, [field]: value } : expense
      )
    );
  };

  // Function to remove a custom expense by its ID
  const removeCustomExpense = (id: string) => {
    setCustomExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const handleCreateBudget = async () => {
    // validate all selected expense templates have an amount
    const allTemplatesHaveAmount = expenseTemplates.every(
      (template) => !template.selected || (template.selected && template.amount)
    );
    if (!allTemplatesHaveAmount) {
      toast.error(t("validate_expense_templates"));
      return;
    }
    // validate all custom expenses have a name, category and amount
    const allCustomExpensesValid = customExpenses.every(
      (expense) => expense.name && expense.category && expense.amount
    );
    if (!allCustomExpensesValid) {
      toast.error(t("validate_custom_expenses"));
      return;
    }

    mutate({
      name: newBudgetName,
      expectedAmount: parseFloat(newBudgetAmount),
      templates: expenseTemplates,
      customs: customExpenses,
    });
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-background py-4 px-2 pb-0",
        isPending ? "opacity-50 pointer-events-none" : ""
      )}
    >
      <div className="max-w-md mx-auto">
        <NewBudgetHeader />

        <div className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {budgetTemplate ? (
                  <>
                    <FileIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      {t("using_template", { name: budgetTemplate?.name })}
                    </span>
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("no_template_selected")}
                    </span>
                  </>
                )}
              </div>
              <Link href="/select-template">
                <Button variant="ghost" size="sm">
                  {t("change")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Budget Details */}
          <BudgetDetailsForm
            newBudgetName={newBudgetName}
            newBudgetAmount={newBudgetAmount}
            setNewBudgetName={setNewBudgetName}
            setNewBudgetAmount={setNewBudgetAmount}
          />

          {/* Preloaded Expenses */}
          <PreloadedExpenses
            expenseTemplates={expenseTemplates}
            toggleExpenseTemplate={toggleExpenseTemplate}
            updateExpenseTemplateAmount={updateExpenseTemplateAmount}
            categories={categories || []}
          />

          {/* Custom Expenses */}
          <CustomExpenses
            customExpenses={customExpenses}
            addCustomExpense={addCustomExpense}
            updateCustomExpense={updateCustomExpense}
            removeCustomExpense={removeCustomExpense}
            categories={categories || []}
          />

          {/* Create Button */}
          <Button
            className="w-full"
            size="lg"
            disabled={!newBudgetName || !newBudgetAmount}
            onClick={handleCreateBudget}
          >
            {t("create_budget")}
          </Button>
        </div>
      </div>
    </div>
  );
}
