import React, { ReactElement } from "react";
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
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";

type ExpenseForm = {
  id: string;
  name: string;
  category: string;
  defaultAmount: string;
};
type ExpenseTemplateFormModalProps = {
  isVisible: boolean;
  isEditing: boolean;
  expense: ExpenseForm;
  isLoading: boolean;
  categories: Category[];
  onClose: () => void;
  onAddExpense: () => void;
  onChangeExpense: (field: string, value: string) => void;
};

const ExpenseTemplateFormModal = ({
  isVisible,
  isEditing,
  isLoading,
  expense,
  categories,
  onClose,
  onAddExpense,
  onChangeExpense,
}: ExpenseTemplateFormModalProps): ReactElement => {
  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-[425px]",
          isLoading && "opacity-50 pointer-events-none"
        )}
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit the expense template for your budgets"
              : "Create a new expense template for your budgets"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="expense-name">Expense Name</Label>
            <Input
              id="expense-name"
              placeholder="e.g., Car Insurance"
              value={expense.name}
              onChange={(e) => onChangeExpense("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expense-category">Category</Label>
            <select
              id="expense-category"
              value={expense.category}
              onChange={(e) => onChangeExpense("category", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expense-amount">Default Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-sm text-muted-foreground">
                $
              </span>
              <Input
                id="expense-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={expense.defaultAmount}
                onChange={(e) =>
                  onChangeExpense("defaultAmount", e.target.value)
                }
                className="pl-8"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={onAddExpense}
            disabled={
              !expense.name || !expense.category || !expense.defaultAmount
            }
          >
            Add Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ExpenseTemplateFormModal;
