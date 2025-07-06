import BudgetTemplatesShell from "@/components/budget_templates/BudgetTemplatesShell";
import {
  fetchCategoriesServer,
  fetchExpensesTemplateServer,
} from "@/lib/supabase/request/server";

const BudgetTemplatesPage = async () => {
  const expenseTemplates = await fetchExpensesTemplateServer();
  const categories = await fetchCategoriesServer();
  return (
    <BudgetTemplatesShell
      expenseTemplates={expenseTemplates}
      categories={categories}
    />
  );
};

export default BudgetTemplatesPage;
