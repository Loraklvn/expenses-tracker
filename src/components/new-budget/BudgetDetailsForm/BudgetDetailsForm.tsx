import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSignIcon } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("new_budget");
  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor="budget-name">{t("budget_name")}</Label>
        <Input
          id="budget-name"
          placeholder={t("budget_name_placeholder")}
          value={newBudgetName}
          onChange={(e) => setNewBudgetName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="budget-amount">{t("budget_amount")}</Label>
        <div className="relative">
          <DollarSignIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="budget-amount"
            type="tel"
            pattern="[0-9]*"
            inputMode="numeric"
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
