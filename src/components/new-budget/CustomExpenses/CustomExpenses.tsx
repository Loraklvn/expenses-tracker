import CustomPopover from "@/components/common/CustomPopover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, CustomExpense } from "@/types";
import {
  DollarSign,
  EllipsisVerticalIcon,
  Plus,
  TrashIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

const CustomExpenses = ({
  customExpenses,
  categories,
  addCustomExpense,
  updateCustomExpense,
  removeCustomExpense,
}: {
  customExpenses: CustomExpense[];
  categories: Category[];
  addCustomExpense: () => void;
  updateCustomExpense: (
    id: string,
    field: keyof CustomExpense,
    value: string | number
  ) => void;
  removeCustomExpense: (id: string) => void;
}): ReactElement => {
  const t = useTranslations("new_budget");

  return (
    <div className="rounded-xl bg-card border border-border/50 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">{t("custom_expenses")}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={addCustomExpense}
          className="rounded-lg h-9 px-3 text-xs font-semibold"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          {t("add")}
        </Button>
      </div>

      {customExpenses.length > 0 ? (
        <div className="divide-y space-y-3 divide-border/50">
          {customExpenses.map((expense) => (
            <div key={expense.id} className="py-3 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Input
                  placeholder={t("name")}
                  value={expense.name}
                  onChange={(e) =>
                    updateCustomExpense(expense.id, "name", e.target.value)
                  }
                  className="flex-1 rounded-xl border-border/50 focus:border-primary/50 transition-colors h-9 bg-background"
                />
                <CustomPopover
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg hover:bg-accent flex-shrink-0"
                    >
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </Button>
                  }
                  content={
                    <div className="flex flex-col gap-1 p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomExpense(expense.id)}
                        className="justify-start rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        {t("remove")}
                      </Button>
                    </div>
                  }
                  contentProps={{
                    className: "w-fit p-0",
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={expense.category}
                  onValueChange={(value) =>
                    updateCustomExpense(expense.id, "category", value)
                  }
                >
                  <SelectTrigger className="w-full rounded-xl border-border/50 h-9 bg-background truncate">
                    <SelectValue placeholder={t("select_category")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={`${category.id}`}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder={t("amount")}
                    type="tel"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={expense.amount}
                    onChange={(e) =>
                      updateCustomExpense(expense.id, "amount", e.target.value)
                    }
                    className="pl-9 rounded-xl border-border/50 focus:border-primary/50 transition-colors h-9 bg-background"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-8">
          {t("no_custom_expenses")}
        </p>
      )}
    </div>
  );
};
export default CustomExpenses;
