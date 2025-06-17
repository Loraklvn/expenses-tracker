import { Button } from "@/components/ui/button";
import { ExpenseWithCurrent } from "@/types";
import { formatCurrency } from "@/utils/numbers";
import { Plus } from "lucide-react";
import { ReactElement } from "react";

const ExpensesList = ({
  expenses,
  onAddTransaction,
}: {
  expenses: ExpenseWithCurrent[];
  onAddTransaction: (expense: ExpenseWithCurrent) => void;
}): ReactElement => {
  return (
    <div className="space-y-1">
      {expenses?.map((expense) => (
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
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
export default ExpensesList;
