import ExpensesShell from "@/components/budget/ExpensesShell";
import {
  fetchBudgetServer,
  fetchExpensesServer,
} from "@/lib/supabase/requests";
import { ReactElement } from "react";

type Params = Promise<{ budgetId: string }>;

interface BudgetPageProps {
  params: Params;
}

const BudgetPage = async ({
  params,
}: BudgetPageProps): Promise<ReactElement> => {
  const { budgetId } = await params; // await to avoid warning

  const budget = await fetchBudgetServer(Number(budgetId));
  const expenses = await fetchExpensesServer(Number(budgetId));

  return <ExpensesShell budget={budget} initialExpenses={expenses} />;
};
export default BudgetPage;
