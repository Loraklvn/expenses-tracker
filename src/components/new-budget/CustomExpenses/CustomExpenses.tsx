import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, CustomExpense } from "@/types";
import { Plus, XIcon } from "lucide-react";
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
    <div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{t("custom_expenses")}</h3>
          <Button variant="outline" size="sm" onClick={addCustomExpense}>
            <Plus className="h-4 w-4 mr-1" />
            {t("add")}
          </Button>
        </div>

        {customExpenses.length > 0 && (
          <div className="space-y-1 mb-4">
            {customExpenses.map((expense) => (
              <div
                className="pt-3 pb-1 border-b transition-colors"
                key={expense.id}
              >
                <div className="relative flex items-center justify-between gap-1 flex-1">
                  <button
                    onClick={() => removeCustomExpense(expense.id)}
                    className="absolute right-0 -top-4"
                  >
                    <XIcon className="h-3 w-3 text-red-500" />
                  </button>
                  <Input
                    placeholder={t("name")}
                    value={expense.name}
                    onChange={(e) =>
                      updateCustomExpense(expense.id, "name", e.target.value)
                    }
                    className="w-[120px]"
                  />

                  <Select
                    value={expense.category}
                    onValueChange={(value) =>
                      updateCustomExpense(expense.id, "category", value)
                    }
                  >
                    <SelectTrigger className="w-[120px] truncate">
                      <SelectValue
                        placeholder={t("select_category")}
                        className="truncate"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t("select_category")}</SelectLabel>

                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={`${category.id}`}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder={t("amount")}
                    type="number"
                    value={expense.amount}
                    onChange={(e) =>
                      updateCustomExpense(expense.id, "amount", e.target.value)
                    }
                    className="w-[120px]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default CustomExpenses;
