import HomeShell from "@/components/home/HomeShell";
import { fetchBudgetsServer } from "@/lib/supabase/request/server";

export default async function HomePage() {
  const budgets = await fetchBudgetsServer(1, 10);

  return <HomeShell budgets={budgets || []} />;
}
