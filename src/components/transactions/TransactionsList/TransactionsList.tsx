import { Button } from "@/components/ui/button";
import { TransactionWithDetails } from "@/types";
import { formatDateToReadable } from "@/utils/date";
import { useTranslations } from "next-intl";
import TransactionItem from "../TransactionItem";

type TransactionsListProps = {
  groupedTransactions: [string, TransactionWithDetails[]][];
  searchTerm: string;
  onClearSearch: () => void;
  onEditTransaction: (transaction: TransactionWithDetails) => void;
  onDeleteTransaction: (transaction: TransactionWithDetails) => void;
};

const TransactionsList = ({
  groupedTransactions,
  searchTerm,
  onClearSearch,
  onEditTransaction,
  onDeleteTransaction,
}: TransactionsListProps) => {
  const t = useTranslations("transactions");

  return (
    <div className="space-y-5">
      {groupedTransactions.length > 0 ? (
        groupedTransactions.map(([date, dayTransactions]) => (
          <div key={date}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              {formatDateToReadable(date)}
            </h3>
            <div className="space-y-2">
              {dayTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onEditTransaction={onEditTransaction}
                  onDeleteTransaction={onDeleteTransaction}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-6 text-base">
            {searchTerm
              ? t("no_transactions_found_matching_your_filters")
              : t("no_transactions_yet")}
          </p>
          {searchTerm ? (
            <Button variant="outline" onClick={onClearSearch}>
              {t("clear_filters")}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
