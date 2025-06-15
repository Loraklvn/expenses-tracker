import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomExpense } from "@/types";
import { Plus, XIcon } from "lucide-react";
import { ReactElement } from "react";

const CustomExpenses = ({
  customExpenses,
  addCustomExpense,
  updateCustomExpense,
  removeCustomExpense,
}: {
  customExpenses: CustomExpense[];
  addCustomExpense: () => void;
  updateCustomExpense: (
    id: string,
    field: keyof CustomExpense,
    value: string | number
  ) => void;
  removeCustomExpense: (id: string) => void;
}): ReactElement => {
  return (
    <div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Custom Expenses</h3>
          <Button variant="outline" size="sm" onClick={addCustomExpense}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {customExpenses.length > 0 && (
          <div className="space-y-1 mb-4">
            {customExpenses.map((expense) => (
              <div
                className="flex items-center justify-between py-2 border-b transition-colors"
                key={expense.id}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Input
                    placeholder="Expense Name"
                    value={expense.name}
                    onChange={(e) =>
                      updateCustomExpense(expense.id, "name", e.target.value)
                    }
                  />

                  <Select
                    value={expense.category}
                    onValueChange={(value) =>
                      updateCustomExpense(expense.id, "category", value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="transportation">
                          Transportation
                        </SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="entertainment">
                          Entertainment
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Amount"
                    type="number"
                    value={expense.amount}
                    onChange={(e) =>
                      updateCustomExpense(expense.id, "amount", e.target.value)
                    }
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCustomExpense(expense.id)}
                >
                  <XIcon className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default CustomExpenses;
