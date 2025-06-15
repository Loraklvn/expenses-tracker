import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Plus, XIcon } from "lucide-react";
import { ReactElement, useState } from "react";

const CustomExpenses = (): ReactElement => {
  const [customExpenses, setCustomExpenses] = useState<
    { name: string; amount: string; category: string }[]
  >([]);
  const [showAddCustomExpense, setShowAddCustomExpense] = useState(false);
  const [newCustomExpense, setNewCustomExpense] = useState({
    name: "",
    amount: "",
    category: "",
  });

  const addCustomExpense = () => {
    if (newCustomExpense.name && newCustomExpense.amount) {
      setCustomExpenses((prev) => [...prev, newCustomExpense]);
      setNewCustomExpense({ name: "", amount: "", category: "" });
      setShowAddCustomExpense(false);
    }
  };

  const removeCustomExpense = (index: number) => {
    setCustomExpenses((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Custom Expenses</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddCustomExpense(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {customExpenses.length > 0 && (
          <div className="space-y-1 mb-4">
            {customExpenses.map((expense, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-3  border-b"
              >
                <div>
                  <p className="font-medium">{expense.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {expense.category}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">${expense.amount}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomExpense(index)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Custom Expense Dialog */}
      <Dialog
        open={showAddCustomExpense}
        onOpenChange={setShowAddCustomExpense}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Custom Expense</DialogTitle>
            <DialogDescription>
              Create a new expense for this budget
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="expense-name">Expense Name</Label>
              <Input
                id="expense-name"
                placeholder="e.g., Car Insurance"
                value={newCustomExpense.name}
                onChange={(e) =>
                  setNewCustomExpense((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-category">Category</Label>
              <Input
                id="expense-category"
                placeholder="e.g., Insurance"
                value={newCustomExpense.category}
                onChange={(e) =>
                  setNewCustomExpense((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Budgeted Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="expense-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newCustomExpense.amount}
                  onChange={(e) =>
                    setNewCustomExpense((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={addCustomExpense}
              disabled={!newCustomExpense.name || !newCustomExpense.amount}
            >
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default CustomExpenses;
