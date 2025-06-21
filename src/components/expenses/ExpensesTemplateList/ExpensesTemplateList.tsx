import { Button } from "@/components/ui/button";
import { Category, ExpenseTemplate } from "@/types";
import { formatCurrency } from "@/utils/numbers";
import { ArchiveIcon, PencilLineIcon, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

type ExpensesTemplateListProps = {
  expenses: ExpenseTemplate[];
  groupedExpenses: Record<string, ExpenseTemplate[]>;
  categories: Category[];
  isEmpty: boolean;
  onOpenEdit: (expense: ExpenseTemplate) => void;
  onArchive: (expense: ExpenseTemplate) => void;
  onAddExpense: () => void;
};

const ExpensesTemplateList = ({
  groupedExpenses,
  categories,
  isEmpty,
  onOpenEdit,
  onArchive,
  onAddExpense,
}: ExpensesTemplateListProps): ReactElement => {
  const t = useTranslations("manage_expenses");
  return (
    <div className="space-y-4">
      {Object.entries(groupedExpenses).map(([categoryId, expenses]) => (
        <div key={categoryId}>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            {categories.find((cat) => cat.id === Number(categoryId))?.name}
          </h3>
          <div className="space-y-1">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between py-3 px-1 border-b border-border/50 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    <div>
                      <p className="font-medium text-base">{expense.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("default")}: {formatCurrency(expense.default_amount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="-space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onOpenEdit(expense)}
                    className="text-gray-500"
                  >
                    <PencilLineIcon className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onArchive(expense)}
                    className="text-gray-500"
                  >
                    <ArchiveIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {isEmpty && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {t("no_expense_templates")}
          </p>
          <Button onClick={onAddExpense}>
            <PlusIcon className="h-4 w-4 mr-2" />
            {t("add_your_first_expense")}
          </Button>
        </div>
      )}
    </div>
  );
};
export default ExpensesTemplateList;
