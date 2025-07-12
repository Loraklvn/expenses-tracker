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
  return (
    <div
      key={expense.id}
      className="flex items-center justify-between py-3 px-1 border-b border-border/50 last:border-b-0"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <CustomPopover
            trigger={
              <EllipsisVerticalIcon className="w-4 h-4 cursor-pointer" />
            }
            content={
              // remove and edit options
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditExpense(expense)}
                >
                  <SquarePenIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteExpense(expense)}
                >
                  <TrashIcon className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            }
            contentProps={{
              className: "w-fit p-0",
            }}
          />
          <div>
            <p className="font-medium text-base">{expense.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(expense.current_amount)} /{" "}
              {formatCurrency(expense.budgeted_amount)}
            </p>
          </div>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          onAddTransaction(expense);
        }}
        className="ml-2"
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
export default BudgetExpenseRow;
