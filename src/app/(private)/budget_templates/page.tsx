import BudgetTemplatesShell from "@/components/budget_templates/BudgetTemplatesShell";
import {
  fetchBudgetTemplatesServer,
  fetchCategoriesServer,
  fetchExpensesTemplateServer,
} from "@/lib/supabase/request/server";

const BudgetTemplatesPage = async () => {
  const expenseTemplates = await fetchExpensesTemplateServer();
  const categories = await fetchCategoriesServer();
  const defaultBudgetTemplates = await fetchBudgetTemplatesServer();
  return (
    <BudgetTemplatesShell
      defaultBudgetTemplates={defaultBudgetTemplates}
      expenseTemplates={expenseTemplates}
      categories={categories}
    />
  );
};

export default BudgetTemplatesPage;
