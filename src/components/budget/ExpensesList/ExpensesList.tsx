import { ExpenseWithCurrent } from "@/types";
import { ReactElement } from "react";
import BudgetExpenseRow from "../BudgetExpenseRow";
import { useTranslations } from "next-intl";

const ExpensesList = ({
  expenses,
  onAddTransaction,
  onEditExpense,
  onDeleteExpense,
}: {
  expenses: ExpenseWithCurrent[];
  onAddTransaction: (expense: ExpenseWithCurrent) => void;
  onEditExpense: (expense: ExpenseWithCurrent) => void;
  onDeleteExpense: (expense: ExpenseWithCurrent) => void;
}): ReactElement => {
  const t = useTranslations("budget_list");

  // Helper function to calculate fulfillment percentage
  const getPercentage = (expense: ExpenseWithCurrent): number => {
    if (expense.budgeted_amount === 0) return 0;
    return (expense.current_amount / expense.budgeted_amount) * 100;
  };

  // Sort expenses: first by percentage (lower percentage first), then alphabetically
  const sortExpenses = (expenses: ExpenseWithCurrent[]) => {
    return expenses.sort((a, b) => {
      const aPercentage = getPercentage(a);
      const bPercentage = getPercentage(b);

      // First sort by percentage in ascending order (lower percentage first)
      if (aPercentage !== bPercentage) {
        return aPercentage - bPercentage;
      }

      // If percentages are equal, sort alphabetically
      return a.name.localeCompare(b.name);
    });
  };

  const templatedExpenses = sortExpenses(
    expenses.filter((expense) => expense.template_id !== null)
  );
  const customExpenses = sortExpenses(
    expenses.filter((expense) => expense.template_id === null)
  );

  return (
    <div className="space-y-5">
      {templatedExpenses.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
            {t("templated_expenses")}
          </h3>
          <div className="space-y-2">
            {templatedExpenses.map((expense) => (
              <BudgetExpenseRow
                key={expense.id}
                expense={expense}
                onAddTransaction={onAddTransaction}
                onEditExpense={onEditExpense}
                onDeleteExpense={onDeleteExpense}
              />
            ))}
          </div>
        </div>
      )}

      {customExpenses.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
            {t("custom_expenses")}
          </h3>
          <div className="space-y-2">
            {customExpenses.map((expense) => (
              <BudgetExpenseRow
                key={expense.id}
                expense={expense}
                onAddTransaction={onAddTransaction}
                onEditExpense={onEditExpense}
                onDeleteExpense={onDeleteExpense}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ExpensesList;
