"use client";

import BudgetDetailsForm from "@/components/new-budget/BudgetDetailsForm";
import CustomExpenses from "@/components/new-budget/CustomExpenses";
import NewBudgetHeader from "@/components/new-budget/NewBudgetHeader";
import PreloadedExpenses from "@/components/new-budget/PreloadedExpenses";
import { Button } from "@/components/ui/button";
import {
  createBudgetWithLinesClient,
  fetchCategoriesClient,
  fetchExpensesTemplateClient,
} from "@/lib/supabase/request/client";
import { cn } from "@/lib/utils";
import { CustomExpense, PreloadedExpenseTemplate } from "@/types";
import { genId } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/dist/client/components/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CreateBudget() {
  const { data: defaultExpensesTemplate } = useQuery({
    queryKey: ["expenseTemplates"],
    queryFn: fetchExpensesTemplateClient,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoriesClient,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createBudgetWithLinesClient,
    onSuccess: (newId) => {
      toast.success("Budget created!");
      router.push(`/budget/${newId}`);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create budget.");
    },
  });

  const router = useRouter();
  const t = useTranslations("new_budget");

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
      selected: true, // Default to selected
      amount: template.default_amount.toString(), // Use default amount as string
    }));
    setSelectedExpenseTemplates(templates);
  }, [defaultExpensesTemplate]);

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
      toast.error(
        "Please ensure all selected expense templates have an amount."
      );
      return;
    }
    // validate all custom expenses have a name, category and amount
    const allCustomExpensesValid = customExpenses.every(
      (expense) => expense.name && expense.category && expense.amount
    );
    if (!allCustomExpensesValid) {
      toast.error(
        "Please ensure all custom expenses have a name, category, and amount."
      );
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
