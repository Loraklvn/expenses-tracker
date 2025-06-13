import ExpensesShell from "@/components/budget/ExpensesShell";
import {
  fetchBudgetClient,
  fetchExpensesClient,
} from "@/lib/supabase/requests";
import { ReactElement } from "react";

interface BudgetPageProps {
  params: { budgetId: string };
}

const BudgetPage = async ({
  params,
}: BudgetPageProps): Promise<ReactElement> => {
  const { budgetId } = await params; // await to avoid warning

  const budget = await fetchBudgetClient(Number(budgetId));
  const expenses = await fetchExpensesClient(Number(budgetId));

  return <ExpensesShell budget={budget} initialExpenses={expenses} />;
};
export default BudgetPage;
