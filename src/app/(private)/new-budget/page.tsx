import NewBudgetShell from "@/components/new-budget/NewBudgetShell";
import {
  fetchBudgetTemplateServer,
  fetchCategoriesServer,
  fetchExpensesTemplateServer,
} from "@/lib/supabase/request/server";

const NewBudgetPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ templateId: string }>;
}) => {
  const params = await searchParams;
  const expenseTemplates = await fetchExpensesTemplateServer();
  const categories = await fetchCategoriesServer();
  const budgetTemplate = params?.templateId
    ? await fetchBudgetTemplateServer(Number(params?.templateId))
    : undefined;

  return (
    <NewBudgetShell
      defaultExpensesTemplate={expenseTemplates}
      categories={categories}
      budgetTemplate={budgetTemplate ?? undefined}
    />
  );
};

export default NewBudgetPage;
