import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ExpenseTemplate } from "@/types";
import { DollarSignIcon } from "lucide-react";
import { ReactElement, useEffect, useState } from "react";

const PreloadedExpenses = ({
  defaultExpensesTemplate,
}: {
  defaultExpensesTemplate: ExpenseTemplate[];
}): ReactElement => {
  const [selectedExpenseTemplates, setSelectedExpenseTemplates] = useState<{
    [key: string]: { selected: boolean; amount: number };
  }>({});

  //   TODO: Try to find a better way to handle this state initialization
  // This is a workaround to ensure the state is initialized with the templates
  // when the component mounts or when the defaultExpensesTemplate changes.
  // Ideally, this should be done in a more React-friendly way, like using a reducer or context.
  // But for now, this will ensure the state is set correctly.

  useEffect(() => {
    const expenseTemplates = defaultExpensesTemplate.reduce((acc, template) => {
      acc[template.id] = {
        selected: true,
        amount: 0,
      };
      return acc;
    }, {} as { [key: string]: { selected: boolean; amount: number } });
    setSelectedExpenseTemplates(expenseTemplates);
  }, [defaultExpensesTemplate]);

  const toggleExpenseTemplate = (templateId: string) => {
    setSelectedExpenseTemplates((prev) => ({
      ...prev,
      [templateId]: {
        selected: !prev[templateId]?.selected,
        amount: prev[templateId]?.amount,
      },
    }));
  };

  const updateExpenseTemplateAmount = (templateId: string, amount: number) => {
    setSelectedExpenseTemplates((prev) => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        amount,
      },
    }));
  };
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Select Expenses</h3>
      <div className="space-y-1">
        {/* sort by select, unselected last */}
        {defaultExpensesTemplate
          .sort((a, b) => {
            const aSelected = selectedExpenseTemplates[a.id]?.selected || false;
            const bSelected = selectedExpenseTemplates[b.id]?.selected || false;
            return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
          })
          .map((template) => {
            const isSelected =
              selectedExpenseTemplates[template.id]?.selected || false;
            const amount = selectedExpenseTemplates[template.id]?.amount || 0;

            return (
              <div
                key={template.id}
                className={`flex items-center justify-between py-2 border-b transition-colors  `}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleExpenseTemplate(template.id)}
                  />
                  <div>
                    <p className="font-medium">{template.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {template.category_id} - category
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <div className="relative w-24">
                    <DollarSignIcon className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) =>
                        updateExpenseTemplateAmount(
                          template.id,
                          Number(e.target.value)
                        )
                      }
                      className="pl-6 h-8 text-sm"
                      placeholder="0"
                    />
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default PreloadedExpenses;
