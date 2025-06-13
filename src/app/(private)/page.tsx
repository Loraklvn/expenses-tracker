import BudgetsList from "@/components/home/BudgetsList";
import { fetchBudgetsClient } from "@/lib/supabase/requests";

export default async function BudgetTracker() {
  const budgets = await fetchBudgetsClient();

  return <BudgetsList budgets={budgets || []} />;
}
