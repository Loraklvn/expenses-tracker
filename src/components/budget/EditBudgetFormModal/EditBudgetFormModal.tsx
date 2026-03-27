"use client";

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
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

export type EditBudgetFormData = {
  name: string;
  expectedAmount: string;
  startDate: string;
  endDate: string;
};

type EditBudgetFormModalProps = {
  visible: boolean;
  isSubmitting: boolean;
  formData: EditBudgetFormData;
  disabledSubmit: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (field: keyof EditBudgetFormData, value: string) => void;
};

const EditBudgetFormModal = ({
  visible,
  isSubmitting,
  formData,
  disabledSubmit,
  onClose,
  onSubmit,
  onChange,
}: EditBudgetFormModalProps): ReactElement => {
  const tBudget = useTranslations("new_budget");
  const tExpenses = useTranslations("expenses");

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{tExpenses("budget")}</DialogTitle>
          <DialogDescription>{tExpenses("update")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-budget-name" className="text-sm font-medium">
              {tBudget("budget_name")} *
            </Label>
            <Input
              id="edit-budget-name"
              value={formData.name}
              placeholder={tBudget("budget_name_placeholder")}
              onChange={(e) => onChange("name", e.target.value)}
              className="rounded-xl border-border/50 focus:border-primary/50 transition-colors h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-budget-amount" className="text-sm font-medium">
              {tBudget("budget_amount")} *
            </Label>
            <Input
              id="edit-budget-amount"
              type="tel"
              inputMode="decimal"
              value={formData.expectedAmount}
              placeholder="0.00"
              onChange={(e) => onChange("expectedAmount", e.target.value)}
              className="rounded-xl border-border/50 focus:border-primary/50 transition-colors h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-budget-start-date" className="text-sm font-medium">
              {tBudget("start_date")} *
            </Label>
            <Input
              id="edit-budget-start-date"
              type="date"
              value={formData.startDate}
              onChange={(e) => onChange("startDate", e.target.value)}
              className="rounded-xl border-border/50 focus:border-primary/50 transition-colors h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-budget-end-date" className="text-sm font-medium">
              {tBudget("end_date")} *
            </Label>
            <Input
              id="edit-budget-end-date"
              type="date"
              min={formData.startDate || undefined}
              value={formData.endDate}
              onChange={(e) => onChange("endDate", e.target.value)}
              className="rounded-xl border-border/50 focus:border-primary/50 transition-colors h-11"
            />
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            className="w-full rounded-xl h-11 px-6 font-semibold shadow-sm"
            onClick={onSubmit}
            disabled={disabledSubmit || isSubmitting}
          >
            {isSubmitting ? tExpenses("update") : tExpenses("update")}
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full text-sm">
            {tExpenses("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBudgetFormModal;
