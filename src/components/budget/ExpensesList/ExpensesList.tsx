import { ExpenseWithCurrent } from "@/types";
import { ReactElement } from "react";
import BudgetExpenseRow from "../BudgetExpenseRow";
import { useTranslations } from "next-intl";

const ExpensesList = ({
  expenses,
  onAddTransaction,
}: {
  expenses: ExpenseWithCurrent[];
  onAddTransaction: (expense: ExpenseWithCurrent) => void;
}): ReactElement => {
  const t = useTranslations("budget_list");
  const templatedExpenses = expenses.filter(
    (expense) => expense.template_id !== null
  );
  const customExpenses = expenses.filter(
    (expense) => expense.template_id === null
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
          />
        ))}
      </div>
    </div>
  );
};
export default ExpensesList;
