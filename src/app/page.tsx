import Navbar from "@/components/common/Navbar";
import HomeShell from "@/components/home/HomeShell";
import LandingPageContent from "@/components/landing/LandingPageContent";
import { fetchBudgetsServer } from "@/lib/supabase/request/server";
import { createServer } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createServer();
  const budgets = await fetchBudgetsServer(1, 10);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return <LandingPageContent />;
  }

  return (
    <div className="max-h-lvh h-full flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <HomeShell budgets={budgets || []} />
      </main>

      <Navbar />
    </div>
  );
}
