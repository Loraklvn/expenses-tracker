import Searchbar from "@/components/common/Searchbar";
import { Button } from "@/components/ui/button";
import { Category, PreloadedExpenseTemplate } from "@/types";
import { ReactElement, useMemo } from "react";
import PreloadedExpenseRow from "../PreloadedExpenseRow";
import { useTranslations } from "next-intl";

const PreloadedExpenses = ({
  expenseTemplates,
  categories,
  toggleExpenseTemplate,
  updateExpenseTemplateAmount,
  searchTerm,
  setSearchTerm,
  onSelectAll,
}: {
  expenseTemplates: PreloadedExpenseTemplate[];
  categories: Category[];
  toggleExpenseTemplate: (templateId: number) => void;
  updateExpenseTemplateAmount: (templateId: number, amount: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSelectAll: () => void;
}): ReactElement => {
  const t = useTranslations("new_budget");

  // Group expenses by category
  const groupedExpenses = useMemo(() => {
    const grouped: Record<number, PreloadedExpenseTemplate[]> = {};
    expenseTemplates.forEach((template) => {
      const categoryId = template.category_id;
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(template);
    });
    return grouped;
  }, [expenseTemplates]);

  return (
    <div className="rounded-xl bg-card border border-border/50 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">{t("select_expenses")}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSelectAll}
          className="rounded-lg h-8 px-3 text-xs font-semibold"
        >
          {t("select_all")}
        </Button>
      </div>

      <div className="mb-4">
        <Searchbar
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
          placeholder={t("search_expenses_placeholder")}
        />
      </div>

      <div className="space-y-4">
        {Object.entries(groupedExpenses).map(([categoryId, templates]) => {
          const category = categories.find(
            (cat) => cat.id === Number.parseInt(categoryId)
          );
          return (
            <div key={categoryId}>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                {category?.name || "Uncategorized"}
              </h4>
              <div className="space-y-1">
                {templates.map((template) => (
                  <PreloadedExpenseRow
                    key={template.id}
                    template={template}
                    toggleExpenseTemplate={toggleExpenseTemplate}
                    updateExpenseTemplateAmount={updateExpenseTemplateAmount}
                    defaultAmount={template.default_amount}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default PreloadedExpenses;
