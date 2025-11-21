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
      className="flex items-center justify-between py-2 px-1 bg-card shadow-sms border rounded-md"
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
            <p className="font-medium text-sms">{expense.name}</p>
            <p className="font-medium text-sm text-muted-foreground">
              <span
                className={`${
                  expense.current_amount > expense.budgeted_amount
                    ? "text-red-600 font-medium"
                    : expense.current_amount > expense.budgeted_amount * 0.8
                    ? "text-yellow-600 font-medium"
                    : "text-green-600"
                }`}
              >
                {formatCurrency(expense.current_amount)}
              </span>
              {" / "}
              <span className="text-gray-700">
                {formatCurrency(expense.budgeted_amount)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          onAddTransaction(expense);
        }}
        className="ml-2 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-1"
      >
        <PlusIcon className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
};
export default BudgetExpenseRow;
