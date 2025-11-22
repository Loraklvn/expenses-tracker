import { Button } from "@/components/ui/button";
import CustomPopover from "@/components/common/CustomPopover";
import { ExpenseWithCurrent } from "@/types";
import { formatCurrency } from "@/utils/numbers";
import {
  EllipsisVerticalIcon,
  PlusIcon,
  SquarePenIcon,
  TrashIcon,
} from "lucide-react";
import React, { ReactElement } from "react";

type BudgetExpenseRowProps = {
  expense: ExpenseWithCurrent;
  onAddTransaction: (expense: ExpenseWithCurrent) => void;
  onEditExpense: (expense: ExpenseWithCurrent) => void;
  onDeleteExpense: (expense: ExpenseWithCurrent) => void;
};

const BudgetExpenseRow = ({
  expense,
  onAddTransaction,
  onEditExpense,
  onDeleteExpense,
}: BudgetExpenseRowProps): ReactElement => {
  const isOverBudget = expense.current_amount > expense.budgeted_amount;
  const isWarning = expense.current_amount > expense.budgeted_amount * 0.8;

  return (
    <div
      key={expense.id}
      className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50 hover:bg-accent/30 transition-all duration-200 active:scale-[0.98] shadow-sm"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <CustomPopover
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-accent flex-shrink-0"
              >
                <EllipsisVerticalIcon className="h-4 w-4" />
              </Button>
            }
            content={
              <div className="flex flex-col gap-1 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditExpense(expense)}
                  className="justify-start rounded-lg"
                >
                  <SquarePenIcon className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteExpense(expense)}
                  className="justify-start rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            }
            contentProps={{
              className: "w-fit p-0",
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base truncate">{expense.name}</p>
            <p className="text-sm mt-0.5">
              <span
                className={`font-semibold ${
                  isOverBudget
                    ? "text-red-600"
                    : isWarning
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {formatCurrency(expense.current_amount)}
              </span>
              <span className="text-muted-foreground">
                {" / "}
                {formatCurrency(expense.budgeted_amount)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <Button
        onClick={() => onAddTransaction(expense)}
        size="icon"
        className="ml-2 h-10 w-10 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary flex-shrink-0 transition-all"
      >
        <PlusIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};
export default BudgetExpenseRow;
