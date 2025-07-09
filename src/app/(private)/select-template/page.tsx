import SelectTemplateShell from "@/components/SelectTemplateShell/page";
import { fetchBudgetTemplatesServer } from "@/lib/supabase/request/server";

const SelectTemplatePage = async () => {
  const budgetTemplates = await fetchBudgetTemplatesServer();

  return <SelectTemplateShell budgetTemplates={budgetTemplates} />;
};

export default SelectTemplatePage;
