import BudgetsList from "@/components/home/BudgetsList";
import { fetchBudgetsServer } from "@/lib/supabase/request/server";

export default async function BudgetTracker() {
  const budgets = await fetchBudgetsServer();

  return <BudgetsList budgets={budgets || []} />;
}
