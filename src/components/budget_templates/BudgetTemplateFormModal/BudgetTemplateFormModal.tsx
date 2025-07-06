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
import { Textarea } from "@/components/ui/textarea";
import React, { ReactElement } from "react";
import { formatCurrency } from "@/utils/numbers";
import { Category, ExpenseTemplate } from "@/types";

type BudgetTemplateFormModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: FormData;
  onChange: (key: string, value: string) => void;
  groupedExpenses: Record<string, ExpenseTemplate[]>;
  selectedExpenses: ExpenseTemplate[];
  toggleExpenseSelection: (expenseId: number) => void;
  categories: Category[];
  isEditing: boolean;
};
type FormData = {
  name: string;
  description: string;
};

const BudgetTemplateFormModal = ({
  visible,
  onClose,
  onSubmit,
  formData,
  onChange,
  groupedExpenses,
  selectedExpenses,
  toggleExpenseSelection,
  categories,
  isEditing,
}: BudgetTemplateFormModalProps): ReactElement => {
  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit" : "Create"} Budget Template
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Edit" : "Create"} a reusable template with your
            preferred expenses
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name *</Label>
            <Input
              id="template-name"
              placeholder="e.g., Monthly Essentials"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-description">Description (optional)</Label>
            <Textarea
              id="template-description"
              placeholder="e.g., Essential expenses for a typical month"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onChange("description", e.target.value)
              }
            />
          </div>

          <div className="space-y-3">
            <Label>Select Expenses</Label>
            {Object.entries(groupedExpenses).map(([category, expenses]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  {categories.find((c) => c.id === Number(category))?.name}
                </h4>
                <div className="space-y-1">
                  {expenses.map((expense) => {
                    const isSelected =
                      selectedExpenses.find((e) => e.id === expense.id) !==
                      undefined;

                    return (
                      <div
                        key={expense.id}
                        className={`flex items-center justify-between py-2 px-3 rounded-lg border transition-colors ${
                          isSelected
                            ? "bg-primary/5 border-primary/20"
                            : "bg-background border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            type="button"
                            onClick={() => toggleExpenseSelection(expense.id)}
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-primary border-primary"
                                : "border-muted-foreground/30"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-sm" />
                            )}
                          </button>
                          <span className="text-sm font-medium">
                            {expense.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="relative w-20">
                            <span className="absolute left-2 top-1.5 text-xs text-muted-foreground">
                              $ {expense.default_amount}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {selectedExpenses.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {selectedExpenses.length} expenses selected
                </span>
                <span className="font-semibold">
                  {formatCurrency(
                    selectedExpenses.reduce(
                      (sum, expense) => sum + expense.default_amount,
                      0
                    )
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={!formData.name.trim() || selectedExpenses.length === 0}
          >
            {isEditing ? "Update" : "Create"} Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default BudgetTemplateFormModal;
