import Searchbar from "@/components/common/Searchbar";
import { useTranslations } from "next-intl";
import TransactionTypeFilter from "../TransactionTypeFilter";

type TransactionsHeaderProps = {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  total: number;
  transactionType: "expense" | "income" | "all";
  onTransactionTypeChange: (type: "expense" | "income" | "all") => void;
};

const TransactionsHeader = ({
  searchTerm,
  onSearchChange,
  total,
  transactionType,
  onTransactionTypeChange,
}: TransactionsHeaderProps) => {
  const t = useTranslations("transactions");
  return (
    <>
      <Searchbar
        searchQuery={searchTerm}
        setSearchQuery={onSearchChange}
        placeholder={t("search_transactions")}
      />

      <TransactionTypeFilter
        transactionType={transactionType}
        onTransactionTypeChange={onTransactionTypeChange}
      />

      <div className="rounded-xl bg-card border border-border/50 p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-muted-foreground">
            {t("total_transactions", { total })}
          </span>
        </div>
      </div>
    </>
  );
};

export default TransactionsHeader;
