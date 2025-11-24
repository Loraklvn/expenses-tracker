import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { ReactElement } from "react";

const BudgetDetailsForm = ({
  newBudgetName,
  newBudgetAmount,
  startDate,
  endDate,
  setNewBudgetName,
  setNewBudgetAmount,
  setStartDate,
  setEndDate,
}: {
  newBudgetName: string;
  newBudgetAmount: string;
  startDate: string;
  endDate: string;
  setNewBudgetName: (value: string) => void;
  setNewBudgetAmount: (value: string) => void;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
}): ReactElement => {
  const t = useTranslations("new_budget");
  return (
    <div className="rounded-xl bg-card border border-border/50 p-4 shadow-sm space-y-4">
      <h3 className="text-base font-semibold">{t("budget_details")}</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="budget-name" className="text-sm font-medium">
            {t("budget_name")} *
          </Label>
          <Input
            id="budget-name"
            placeholder={t("budget_name_placeholder")}
            value={newBudgetName}
            onChange={(e) => setNewBudgetName(e.target.value)}
            className="rounded-xl border-border/50 focus:border-primary/50 transition-colors h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget-amount" className="text-sm font-medium">
            {t("budget_amount")} *
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="budget-amount"
              type="tel"
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder="0.00"
              value={newBudgetAmount}
              onChange={(e) => setNewBudgetAmount(e.target.value)}
              className="pl-10 rounded-xl border-border/50 focus:border-primary/50 transition-colors h-11"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="start-date" className="text-sm font-medium">
            {t("start_date")} *
          </Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-xl border-border/50 focus:border-primary/50 transition-colors h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date" className="text-sm font-medium">
            {t("end_date")} *
          </Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || undefined}
            className="rounded-xl border-border/50 focus:border-primary/50 transition-colors h-11"
          />
        </div>
      </div>
    </div>
  );
};
export default BudgetDetailsForm;
