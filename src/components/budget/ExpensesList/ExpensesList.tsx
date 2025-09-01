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

  // Helper function to check if expense is at or above limit
  const isAtOrAboveLimit = (expense: ExpenseWithCurrent) => {
    return expense.current_amount >= expense.budgeted_amount * 0.8;
  };

  // Sort expenses: first by limit status (below limit first), then alphabetically
  const sortExpenses = (expenses: ExpenseWithCurrent[]) => {
    return expenses.sort((a, b) => {
      // First sort by limit status (below limit items first)
      const aAtLimit = isAtOrAboveLimit(a);
      const bAtLimit = isAtOrAboveLimit(b);

      if (aAtLimit && !bAtLimit) return 1; // a goes after b
      if (!aAtLimit && bAtLimit) return -1; // a goes before b

      // If both have same limit status, sort alphabetically
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
    <div className="space-y-2">
      <div className="space-y-1">
        <h3 className="text-sm font-medium">{t("templated_expenses")}</h3>
        {templatedExpenses?.map((expense) => (
          <BudgetExpenseRow
            key={expense.id}
            expense={expense}
            onAddTransaction={onAddTransaction}
            onEditExpense={onEditExpense}
            onDeleteExpense={onDeleteExpense}
          />
        ))}
      </div>

      <div className="space-y-1 border-t border-border/50 pt-2">
        <h3 className="font-medium">{t("custom_expenses")}</h3>
        {customExpenses?.map((expense) => (
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
  );
};
export default ExpensesList;
