import CustomPopover from "@/components/common/CustomPopover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TransactionWithDetails } from "@/types";
import { formatCurrency } from "@/utils/numbers";
import { EllipsisVerticalIcon, SquarePenIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type TransactionItemProps = {
  transaction: TransactionWithDetails;
  onEditTransaction: (transaction: TransactionWithDetails) => void;
  onDeleteTransaction: (transaction: TransactionWithDetails) => void;
};

const TransactionItem = ({
  transaction,
  onEditTransaction,
  onDeleteTransaction,
}: TransactionItemProps) => {
  const t = useTranslations("transactions");

  return (
    <div
      key={transaction.id}
      className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50 hover:bg-accent/30 transition-all duration-200 active:scale-[0.98] shadow-sm"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`w-3 h-3 rounded-full flex-shrink-0 ${
            transaction.type === "expense" ? "bg-red-500" : "bg-green-500"
          }`}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base truncate">
            {transaction.expense_name || transaction.income_source_name}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
            {transaction.description || "No description"}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <Badge variant="outline" className="text-xs">
              {transaction.budget_name || transaction.income_source_name}
            </Badge>
            <span className="text-xs font-semibold text-foreground">
              {formatCurrency(transaction.amount)}
            </span>
          </div>
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
              onClick={() => onEditTransaction(transaction)}
              className="justify-start rounded-lg"
            >
              <SquarePenIcon className="h-4 w-4 mr-2" />
              {t("edit_transaction")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteTransaction(transaction)}
              className="justify-start rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {t("delete")}
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

export default TransactionItem;
