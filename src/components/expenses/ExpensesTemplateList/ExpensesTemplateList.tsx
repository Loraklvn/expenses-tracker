import { Button } from "@/components/ui/button";
import { Category, ExpenseTemplate } from "@/types";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";
import ExpenseItem from "../ExpenseItem";

type ExpensesTemplateListProps = {
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
    <div className="space-y-5">
      {Object.entries(groupedExpenses).map(([categoryId, expenses]) => {
        const category = categories.find(
          (cat) => cat.id === Number(categoryId)
        );
        return (
          <div key={categoryId} className="space-y-2">
            {category && (
              <div className="flex items-center gap-2 px-1">
                <div
                  className="w-4 h-4 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {category.name}
                </h3>
              </div>
            )}
            <div className="space-y-2">
              {expenses.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  onOpenEdit={onOpenEdit}
                  onArchive={onArchive}
                />
              ))}
            </div>
          </div>
        );
      })}

      {isEmpty && (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-6 text-base">
            {t("no_expense_templates")}
          </p>
          <Button
            onClick={onAddExpense}
            className="rounded-xl h-11 px-6 font-semibold"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {t("add_your_first_expense")}
          </Button>
        </div>
      )}
    </div>
  );
};
export default ExpensesTemplateList;
