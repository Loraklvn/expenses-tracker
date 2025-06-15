"use client";

import BudgetDetailsForm from "@/components/new-budget/BudgetDetailsForm";
import CustomExpenses from "@/components/new-budget/CustomExpenses";
import NewBudgetHeader from "@/components/new-budget/NewBudgetHeader";
import PreloadedExpenses from "@/components/new-budget/PreloadedExpenses";
import { Button } from "@/components/ui/button";
import { fetchExpensesTemplateClient } from "@/lib/supabase/requests";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function CreateBudget() {
  const { data: expenseTemplates } = useQuery({
    queryKey: ["expenseTemplates"],
    queryFn: fetchExpensesTemplateClient,
  });
  const [newBudgetName, setNewBudgetName] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");

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
          <PreloadedExpenses defaultExpensesTemplate={expenseTemplates || []} />

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
