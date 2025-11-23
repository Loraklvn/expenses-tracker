import Searchbar from "@/components/common/Searchbar";
import { useTranslations } from "next-intl";

type TransactionsHeaderProps = {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  total: number;
};

const TransactionsHeader = ({
  searchTerm,
  onSearchChange,
  total,
}: TransactionsHeaderProps) => {
  const t = useTranslations("transactions");
  return (
    <>
      <Searchbar
        searchQuery={searchTerm}
        setSearchQuery={onSearchChange}
        placeholder={t("search_transactions")}
      />

      {/* Summary */}
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
