import CustomPopover from "@/components/common/CustomPopover";
import { Button } from "@/components/ui/button";
import { ExpenseTemplate } from "@/types";
import { formatCurrency } from "@/utils/numbers";
import { EllipsisVerticalIcon, SquarePenIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

type ExpenseItemProps = {
  expense: ExpenseTemplate;
  onOpenEdit: (expense: ExpenseTemplate) => void;
  onArchive: (expense: ExpenseTemplate) => void;
};
const ExpenseItem = ({
  expense,
  onOpenEdit,
  onArchive,
}: ExpenseItemProps): ReactElement => {
  const t = useTranslations("manage_expenses");

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50 hover:bg-accent/30 transition-all duration-200 active:scale-[0.98] shadow-sm">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base truncate">{expense.name}</p>
          <p className="text-sm text-muted-foreground">
            {t("default")}: {formatCurrency(expense.default_amount)}
          </p>
        </div>
      </div>
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
              onClick={() => onOpenEdit(expense)}
              className="justify-start rounded-lg"
            >
              <SquarePenIcon className="h-4 w-4 mr-2" />
              {t("edit_expense")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onArchive(expense)}
              className="justify-start rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {t("archive_expense", { expenseName: expense.name })}
            </Button>
          </div>
        }
        contentProps={{
          className: "w-fit p-0",
        }}
      />
    </div>
  );
};
export default ExpenseItem;
