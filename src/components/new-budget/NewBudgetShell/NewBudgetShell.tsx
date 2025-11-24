"use client";

import BudgetDetailsForm from "@/components/new-budget/BudgetDetailsForm";
import CustomExpenses from "@/components/new-budget/CustomExpenses";
import PreloadedExpenses from "@/components/new-budget/PreloadedExpenses";
import { Button } from "@/components/ui/button";
import { createBudgetWithLinesClient } from "@/lib/supabase/request/client";
import {
  BudgetTemplateWithStats,
  Category,
  CustomExpense,
  ExpenseTemplate,
  PreloadedExpenseTemplate,
} from "@/types";
import { genId } from "@/utils";
import { getFirstDayOfMonth, getLastDayOfMonth } from "@/utils/date";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Check, FileIcon, Loader2, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/dist/client/components/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getLastDayOfMonth());
  const [searchTerm, setSearchTerm] = useState("");

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

  // Select all expenses
  const selectAllExpenses = () => {
    setSelectedExpenseTemplates((prev) =>
      prev.map((template) => ({ ...template, selected: true }))
    );
  };

  // Filter expenses by search term
  const filteredExpenseTemplates = useMemo(() => {
    if (!searchTerm) return expenseTemplates;
    const lowerSearch = searchTerm.toLowerCase();
    return expenseTemplates.filter(
      (template) =>
        template.name.toLowerCase().includes(lowerSearch) ||
        categories
          .find((cat) => cat.id === template.category_id)
          ?.name.toLowerCase()
          .includes(lowerSearch)
    );
  }, [expenseTemplates, searchTerm, categories]);

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
    // validate dates are provided
    if (!startDate || !endDate) {
      toast.error(t("validate_dates"));
      return;
    }
    // validate end date is after start date
    if (new Date(endDate) < new Date(startDate)) {
      toast.error(t("validate_date_range"));
      return;
    }

    mutate({
      name: newBudgetName,
      expectedAmount: parseFloat(newBudgetAmount),
      startDate,
      endDate,
      templates: expenseTemplates,
      customs: customExpenses,
    });
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 pb-32 ${
        isPending ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg hover:bg-accent transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold tracking-tight">{t("title")}</h1>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Template Info */}
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {budgetTemplate ? (
                  <>
                    <FileIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                        {t("template")}
                      </p>
                      <p className="text-sm font-semibold text-foreground truncate">
                        {budgetTemplate?.name}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <PlusIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {t("template")}
                      </p>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {t("no_template_selected")}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <Link href="/select-template">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg h-9 px-3 text-xs font-semibold flex-shrink-0 border-blue-200 bg-white hover:bg-blue-50"
                >
                  {t("change")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Budget Details */}
          <BudgetDetailsForm
            newBudgetName={newBudgetName}
            newBudgetAmount={newBudgetAmount}
            startDate={startDate}
            endDate={endDate}
            setNewBudgetName={setNewBudgetName}
            setNewBudgetAmount={setNewBudgetAmount}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />

          {/* Preloaded Expenses */}
          <PreloadedExpenses
            expenseTemplates={filteredExpenseTemplates}
            toggleExpenseTemplate={toggleExpenseTemplate}
            updateExpenseTemplateAmount={updateExpenseTemplateAmount}
            categories={categories || []}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSelectAll={selectAllExpenses}
          />

          {/* Custom Expenses */}
          <CustomExpenses
            customExpenses={customExpenses}
            addCustomExpense={addCustomExpense}
            updateCustomExpense={updateCustomExpense}
            removeCustomExpense={removeCustomExpense}
            categories={categories || []}
          />
        </div>
      </div>

      {/* Fixed Create Button - Positioned above navbar */}
      <div className="fixed bottom-[84px] left-0 right-0 z-[60] bg-background/95 backdrop-blur-lg border-t ">
        <div className="max-w-md mx-auto px-4 py-3">
          <Button
            className="w-full rounded-xl h-12 px-6 font-semibold  transition-all duration-200 active:scale-[0.98]"
            disabled={
              !newBudgetName ||
              !newBudgetAmount ||
              !startDate ||
              !endDate ||
              isPending
            }
            onClick={handleCreateBudget}
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                {t("creating")}
              </>
            ) : (
              <>
                <Check className="h-5 w-5 mr-2" />
                {t("create_budget")}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
