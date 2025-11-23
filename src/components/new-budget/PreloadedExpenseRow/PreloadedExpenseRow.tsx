import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PreloadedExpenseTemplate } from "@/types";
import { DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { ReactElement } from "react";
import { formatCurrency } from "@/utils/numbers";

const PreloadedExpenseRow = ({
  template,
  toggleExpenseTemplate,
  updateExpenseTemplateAmount,
  defaultAmount,
}: {
  template: PreloadedExpenseTemplate;
  toggleExpenseTemplate: (templateId: number) => void;
  updateExpenseTemplateAmount: (templateId: number, amount: string) => void;
  defaultAmount: number;
}): ReactElement => {
  const t = useTranslations("new_budget");
  return (
    <div className="flex items-center justify-between py-3 px-1">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Checkbox
          checked={template.selected}
          onCheckedChange={() => toggleExpenseTemplate(template.id)}
          className="flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-base">{template.name}</p>
          <p className="text-sm text-muted-foreground">
            {t("default")}: {formatCurrency(defaultAmount)}
          </p>
        </div>
      </div>
      <div className="relative w-28 flex-shrink-0 ml-2">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="tel"
          pattern="[0-9]*"
          inputMode="numeric"
          value={template.amount}
          onChange={(e) =>
            updateExpenseTemplateAmount(template.id, e.target.value)
          }
          disabled={!template.selected}
          className={`pl-9 rounded-xl border-border/50 focus:border-primary/50 transition-colors h-9 text-sm bg-background ${
            !template.selected ? "opacity-50" : ""
          }`}
          placeholder="0.00"
        />
      </div>
    </div>
  );
};
export default PreloadedExpenseRow;
