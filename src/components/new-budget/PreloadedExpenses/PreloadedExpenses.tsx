import { Category, PreloadedExpenseTemplate } from "@/types";
import { ReactElement } from "react";
import PreloadedExpenseRow from "../PreloadedExpenseRow";
import { useTranslations } from "next-intl";

const PreloadedExpenses = ({
  expenseTemplates,
  categories,
  toggleExpenseTemplate,
  updateExpenseTemplateAmount,
}: {
  expenseTemplates: PreloadedExpenseTemplate[];
  categories: Category[];
  toggleExpenseTemplate: (templateId: string) => void;
  updateExpenseTemplateAmount: (templateId: string, amount: string) => void;
}): ReactElement => {
  const t = useTranslations("new_budget");
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{t("select_expenses")}</h3>
      <div className="space-y-1">
        {/* sort by select, unselected last */}
        {expenseTemplates
          .sort((a, b) => {
            return (
              (b.selected ? 1 : 0) - (a.selected ? 1 : 0) ||
              a.name.localeCompare(b.name)
            );
          })
          .map((template) => (
            <PreloadedExpenseRow
              key={template.id}
              template={template}
              toggleExpenseTemplate={toggleExpenseTemplate}
              updateExpenseTemplateAmount={updateExpenseTemplateAmount}
              category={
                categories.find((cat) => cat.id === template.category_id)
                  ?.name || "Uncategorized"
              }
            />
          ))}
      </div>
    </div>
  );
};
export default PreloadedExpenses;
