"use client";

import BudgetDetailsForm from "@/components/new-budget/BudgetDetailsForm";
import CustomExpenses from "@/components/new-budget/CustomExpenses";
import NewBudgetHeader from "@/components/new-budget/NewBudgetHeader";
import PreloadedExpenses from "@/components/new-budget/PreloadedExpenses";
import { Button } from "@/components/ui/button";
import { fetchExpensesTemplateClient } from "@/lib/supabase/requests";
import { PreloadedExpenseTemplate } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function CreateBudget() {
  const { data: defaultExpensesTemplate } = useQuery({
    queryKey: ["expenseTemplates"],
    queryFn: fetchExpensesTemplateClient,
  });

  // Initialize the state for new budget details
  const [newBudgetName, setNewBudgetName] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");

  // Initialize the state for preloaded expense templates
  const [expenseTemplates, setSelectedExpenseTemplates] = useState<
    PreloadedExpenseTemplate[]
  >([]);

  // Set the default selected expense templates when the component mounts
  useEffect(() => {
    if (!defaultExpensesTemplate) return;
    const templates = defaultExpensesTemplate.map((template) => ({
      ...template,
      selected: true, // Default to selected
      amount: "", // Default amount
    }));
    setSelectedExpenseTemplates(templates);
  }, [defaultExpensesTemplate]);

  const toggleExpenseTemplate = (templateId: string) => {
    setSelectedExpenseTemplates((prev) => {
      const updatedTemplates = prev.map((template) =>
        template.id === templateId
          ? { ...template, selected: !template.selected }
          : template
      );
      return updatedTemplates;
    });
  };

  const updateExpenseTemplateAmount = (templateId: string, amount: string) => {
    setSelectedExpenseTemplates((prev) => {
      const updatedTemplates = prev.map((template) =>
        template.id === templateId ? { ...template, amount } : template
      );
      return updatedTemplates;
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-0">
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
          />

          {/* Custom Expenses */}
          <CustomExpenses />

          {/* Create Button */}
          <Button
            className="w-full"
            size="lg"
            disabled={!newBudgetName || !newBudgetAmount}
            // onClick={handleCreateBudget}
          >
            Create Budget
          </Button>
        </div>
      </div>
    </div>
  );
}
