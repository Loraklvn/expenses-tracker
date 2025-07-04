import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("search_transactions")}
          value={searchTerm}
          onChange={(e) => {
            onSearchChange(e.target.value);
          }}
          className="pl-10"
        />
      </div>

      {/* Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {t("total_transactions", { total })}
          </span>
        </div>
      </div>
    </>
  );
};

export default TransactionsHeader;
