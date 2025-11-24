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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IncomeSource } from "@/types";
import { DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";

type AddIncomeModalProps = {
  visible: boolean;
  formValues: {
    description: string;
    amount: string;
    incomeSourceId: string;
    transactionDate: string;
  };
  onChange: (field: string, value: string | number) => void;
  incomeSources: IncomeSource[];
  isCreatingIncome: boolean;
  onSubmit: () => void;
  onClose: () => void;
};

const AddIncomeModal = ({
  visible,
  formValues,
  onChange,
  incomeSources,
  isCreatingIncome,
  onSubmit,
  onClose,
}: AddIncomeModalProps) => {
  const t = useTranslations("income");

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t("new_income")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t("add_income_modal_description")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="income-amount" className="text-sm font-medium">
              {t("amount")} *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="income-amount"
                type="tel"
                step="0.01"
                placeholder={t("amount_placeholder")}
                value={formValues.amount}
                onChange={(e) => onChange("amount", e.target.value)}
                className="pl-10 rounded-xl border-border/50 focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="income-description" className="text-sm font-medium">
              {t("description")} (optional)
            </Label>
            <Input
              id="income-description"
              placeholder={t("description_placeholder")}
              value={formValues.description}
              onChange={(e) => onChange("description", e.target.value)}
              className="rounded-xl border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="income-source" className="text-sm font-medium">
              {t("source")} *
            </Label>
            <Select
              value={formValues.incomeSourceId}
              onValueChange={(value) => onChange("incomeSourceId", value)}
            >
              <SelectTrigger className="w-full rounded-xl border-border/50">
                <SelectValue placeholder={t("select_category")} />
              </SelectTrigger>
              <SelectContent>
                {incomeSources.map((source) => (
                  <SelectItem key={source.id} value={source.id.toString()}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      {source.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="transaction-date" className="text-sm font-medium">
              {t("date")} *
            </Label>
            <Input
              id="transaction-date"
              type="date"
              value={formValues.transactionDate}
              onChange={(e) => onChange("transactionDate", e.target.value)}
              className="rounded-xl border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            className="w-full rounded-xl h-11 px-6 font-semibold shadow-sm"
            onClick={onSubmit}
            disabled={
              isCreatingIncome ||
              !formValues.amount ||
              !formValues.incomeSourceId ||
              !formValues.transactionDate
            }
          >
            {isCreatingIncome ? t("adding") : t("save_income")}
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full text-sm">
            {t("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddIncomeModal;
