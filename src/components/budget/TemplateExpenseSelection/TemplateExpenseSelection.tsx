import { Label } from "@/components/ui/label";
import { Category, ExpenseTemplate } from "@/types";
import { formatCurrency } from "@/utils/numbers";
import { useTranslations } from "next-intl";
import React, { ReactElement } from "react";

const TemplateExpenseSelection = ({
  unusedTemplateExpenses,
  selectedTemplateExpense,
  setSelectedTemplateExpense,
  categories,
}: {
  unusedTemplateExpenses: ExpenseTemplate[];
  selectedTemplateExpense: ExpenseTemplate | null;
  setSelectedTemplateExpense: (template: ExpenseTemplate) => void;
  categories: Category[];
}): ReactElement => {
  const t = useTranslations("budget_list");
  return (
    <div className="space-y-3">
      <Label>{t("select_from_available_templates")}</Label>
      {unusedTemplateExpenses.length > 0 ? (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {unusedTemplateExpenses.map((template) => (
            <div
              key={template.id}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedTemplateExpense?.id === template.id
                  ? "bg-primary/5 border-primary/20"
                  : "bg-background border-border hover:bg-muted/50"
              }`}
              onClick={() => setSelectedTemplateExpense(template)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedTemplateExpense?.id === template.id
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {selectedTemplateExpense?.id === template.id && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {
                      categories.find(
                        (category) => category.id === template.category_id
                      )?.name
                    }
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium">
                {formatCurrency(template.default_amount)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>{t("all_template_expenses_have_been_added_to_this_budget")}</p>
        </div>
      )}
    </div>
  );
};
export default TemplateExpenseSelection;
