import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

type ExpenseForm = {
  id: number;
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
  const t = useTranslations("manage_expenses");

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
            {isEditing ? t("edit_expense") : t("add_expense")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="expense-name">{t("expense_name")}</Label>
            <Input
              id="expense-name"
              placeholder={t("expense_name_placeholder")}
              value={expense.name}
              onChange={(e) => onChangeExpense("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expense-category">{t("category")}</Label>
            <select
              id="expense-category"
              value={expense.category}
              onChange={(e) => onChangeExpense("category", e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{t("select_category")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expense-amount">{t("default_amount")}</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-sm text-muted-foreground">
                $
              </span>
              <Input
                id="expense-amount"
                type="tel"
                pattern="[0-9]*"
                inputMode="numeric"
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
            {isEditing ? t("edit_expense") : t("add_expense")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ExpenseTemplateFormModal;
