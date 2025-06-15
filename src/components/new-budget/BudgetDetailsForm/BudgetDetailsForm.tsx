import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSignIcon } from "lucide-react";
import React, { ReactElement } from "react";

const BudgetDetailsForm = ({
  newBudgetName,
  newBudgetAmount,
  setNewBudgetName,
  setNewBudgetAmount,
}: {
  newBudgetName: string;
  newBudgetAmount: string;
  setNewBudgetName: (value: string) => void;
  setNewBudgetAmount: (value: string) => void;
}): ReactElement => {
  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor="budget-name">Budget Name</Label>
        <Input
          id="budget-name"
          placeholder="e.g., March 2024"
          value={newBudgetName}
          onChange={(e) => setNewBudgetName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="budget-amount">Total Budget Amount</Label>
        <div className="relative">
          <DollarSignIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="budget-amount"
            type="number"
            placeholder="0.00"
            value={newBudgetAmount}
            onChange={(e) => setNewBudgetAmount(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};
export default BudgetDetailsForm;
