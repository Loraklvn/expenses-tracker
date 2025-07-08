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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("budget_templates");

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col px-2">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("edit_template") : t("create_template")}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("edit_template_description")
              : t("create_template_description")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-y-auto flex-1 px-4 scrollbar-hide">
          <div className="space-y-2">
            <Label htmlFor="template-name">{t("template_name")} *</Label>
            <Input
              id="template-name"
              placeholder="e.g., Monthly Essentials"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-description">{t("description")} </Label>
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
            <Label>{t("select_expenses")}</Label>
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
                          <span className="text-xs font-semibold">
                            {formatCurrency(expense.default_amount)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="-mt-2 ">
          <div className="w-full flex flex-col gap-2">
            {selectedExpenses.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {t("expenses_selected", { count: selectedExpenses.length })}
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

            <div className="w-full flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                {t("delete_template_cancel")}
              </Button>
              <Button
                type="submit"
                onClick={onSubmit}
                disabled={
                  !formData.name.trim() || selectedExpenses.length === 0
                }
              >
                {isEditing ? t("update_template") : t("create_template")}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default BudgetTemplateFormModal;
