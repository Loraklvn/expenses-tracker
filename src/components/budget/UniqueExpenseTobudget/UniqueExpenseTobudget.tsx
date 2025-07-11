import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types";
import { DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { ReactElement } from "react";

const UniqueExpenseTobudget = ({
  customExpenseForm,
  onChange,
  categories,
}: {
  customExpenseForm: { name: string; category: string; amount: string };
  onChange: (field: string, value: string) => void;
  categories: Category[];
}): ReactElement => {
  const t = useTranslations("budget_list");
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="custom-expense-name">{t("expense_name")} *</Label>
        <Input
          id="custom-expense-name"
          placeholder={t("expense_name_placeholder")}
          value={customExpenseForm.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Select
          value={customExpenseForm.category}
          onValueChange={(value) => onChange("category", value)}
        >
          <Label htmlFor="custom-expense-category">{t("category")} *</Label>

          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("select_category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{t("select_category")}</SelectLabel>

              {categories.map((category) => (
                <SelectItem key={category.id} value={`${category.id}`}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="custom-expense-amount">{t("budgeted_amount")} *</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="custom-expense-amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={customExpenseForm.amount}
            onChange={(e) => onChange("amount", e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};
export default UniqueExpenseTobudget;
