import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PreloadedExpenseTemplate } from "@/types";
import { DollarSignIcon } from "lucide-react";
import { ReactElement } from "react";

const PreloadedExpenses = ({
  expenseTemplates,
  toggleExpenseTemplate,
  updateExpenseTemplateAmount,
}: {
  expenseTemplates: PreloadedExpenseTemplate[];
  toggleExpenseTemplate: (templateId: string) => void;
  updateExpenseTemplateAmount: (templateId: string, amount: string) => void;
}): ReactElement => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Select Expenses</h3>
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
            <div
              key={template.id}
              className="flex items-center justify-between py-2 border-b transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <Checkbox
                  checked={template.selected}
                  onCheckedChange={() => toggleExpenseTemplate(template.id)}
                />
                <div>
                  <p className="font-medium">{template.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {template.category_id} - category
                  </p>
                </div>
              </div>
              {template.selected && (
                <div className="relative w-24">
                  <DollarSignIcon className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                  <Input
                    type="number"
                    value={template.amount}
                    onChange={(e) =>
                      updateExpenseTemplateAmount(template.id, e.target.value)
                    }
                    className="pl-6 h-8 text-sm"
                    placeholder="0"
                  />
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
export default PreloadedExpenses;
