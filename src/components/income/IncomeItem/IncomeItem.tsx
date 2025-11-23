import CustomPopover from "@/components/common/CustomPopover";
import { Button } from "@/components/ui/button";
import { IncomeSource, Transaction } from "@/types";
import { formatDateToReadable } from "@/utils/date";
import { formatCurrency } from "@/utils/numbers";
import { EllipsisVerticalIcon, TrashIcon, TrendingUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

type IncomeItemProps = {
  transaction: Transaction;
  incomeSource: IncomeSource;
  onDeleteClick: (transaction: Transaction) => void;
};

const IncomeItem = ({
  transaction,
  incomeSource,
  onDeleteClick,
}: IncomeItemProps): ReactElement => {
  const t = useTranslations("income");

  return (
    <div
      key={transaction.id}
      className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50 hover:bg-accent/30 transition-all duration-200 active:scale-[0.98] shadow-sm"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <TrendingUpIcon className="h-6 w-6 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base ">{incomeSource?.name}</p>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
            {transaction.description || incomeSource?.name}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5 ">
            {formatDateToReadable(transaction.transaction_date)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          <p className="font-semibold text-green-600 text-base">
            +{formatCurrency(transaction.amount)}
          </p>
        </div>
        {onDeleteClick && (
          <CustomPopover
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg hover:bg-accent"
              >
                <EllipsisVerticalIcon className="h-5 w-5" />
              </Button>
            }
            content={
              <div className="flex flex-col gap-1 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteClick(transaction)}
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
        )}
      </div>
    </div>
  );
};
export default IncomeItem;
