"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DollarSign, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

type NewIncomeForm = {
  formValues: {
    description: string;
    amount: string;
    incomeSourceId: string;
  };
  onChange: (field: string, value: string | number) => void;
  incomeSources: IncomeSource[];
  isCreatingIncome: boolean;
  onSubmit: () => void;
};

const AddIncomeForm = ({
  formValues,
  onChange,
  incomeSources,
  isCreatingIncome,
  onSubmit,
}: NewIncomeForm) => {
  const t = useTranslations("income");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{t("add_income")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="income-description">{t("description")} *</Label>
          <Input
            id="income-description"
            placeholder={t("description_placeholder")}
            value={formValues.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="income-amount">{t("amount")} *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="income-amount"
              type="number"
              step="0.01"
              placeholder={t("amount_placeholder")}
              value={formValues.amount}
              onChange={(e) => onChange("amount", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="income-source">{t("income_source")} *</Label>
          <Select
            value={formValues.incomeSourceId}
            onValueChange={(value) => onChange("incomeSourceId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("select_income_source")} />
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
        <Button
          className="w-full"
          onClick={onSubmit}
          disabled={
            isCreatingIncome ||
            !formValues.description ||
            !formValues.amount ||
            !formValues.incomeSourceId
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          {isCreatingIncome ? t("adding") : t("add_income_button")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddIncomeForm;
