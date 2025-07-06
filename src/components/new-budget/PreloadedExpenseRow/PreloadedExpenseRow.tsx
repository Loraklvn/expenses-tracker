import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PreloadedExpenseTemplate } from "@/types";
import { DollarSignIcon } from "lucide-react";
import React, { ReactElement } from "react";

const PreloadedExpenseRow = ({
  template,
  category,
  toggleExpenseTemplate,
  updateExpenseTemplateAmount,
}: {
  template: PreloadedExpenseTemplate;
  category: string;
  toggleExpenseTemplate: (templateId: number) => void;
  updateExpenseTemplateAmount: (templateId: number, amount: string) => void;
}): ReactElement => {
  return (
    <div className="flex items-center justify-between py-2 border-b transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          checked={template.selected}
          onCheckedChange={() => toggleExpenseTemplate(template.id)}
        />
        <div>
          <p className="font-medium">{template.name}</p>
          <p className="text-sm text-muted-foreground">{category}</p>
        </div>
      </div>
      {template.selected && (
        <div className="relative w-24">
          <DollarSignIcon className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
          <Input
            type="tel"
            pattern="[0-9]*"
            inputMode="numeric"
            value={template.amount}
            onChange={(e) =>
              updateExpenseTemplateAmount(template.id, e.target.value)
            }
            className="pl-6 h-8"
            placeholder="0"
          />
        </div>
      )}
    </div>
  );
};
export default PreloadedExpenseRow;
