import ExpensesList from "@/components/expenses/ExpensesList/ExpensesList";
import {
  fetchBudgetClient,
  fetchExpensesClient,
} from "@/lib/supabase/requests";
import React, { ReactElement } from "react";

interface BudgetPageProps {
  params: { budgetId: string };
}

const BudgetPage = async ({
  params,
}: BudgetPageProps): Promise<ReactElement> => {
  const { budgetId } = await params; // await to avoid warning

  const budget = await fetchBudgetClient(Number(budgetId));
  const expenses = await fetchExpensesClient(Number(budgetId));

  return (
    <div>
      <ExpensesList budget={budget} expenses={expenses} />
    </div>
  );
};
export default BudgetPage;
