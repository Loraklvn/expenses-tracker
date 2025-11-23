import React, { ReactElement } from "react";
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type TransactionTypeFilterProps = {
  transactionType: "expense" | "income" | "all";
  onTransactionTypeChange: (
    transactionType: "expense" | "income" | "all"
  ) => void;
};

const TransactionTypeFilter = ({
  transactionType,
  onTransactionTypeChange,
}: TransactionTypeFilterProps): ReactElement => {
  const t = useTranslations("transactions");

  return (
    <div className="flex bg-muted rounded-lg p-1">
      <button
        onClick={() => onTransactionTypeChange("all")}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
          transactionType === "all"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {t("all")}
      </button>
      <button
        onClick={() => onTransactionTypeChange("expense")}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
          transactionType === "expense"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <ArrowUpCircleIcon
          className={`h-4 w-4 ${
            transactionType === "expense"
              ? "text-red-600"
              : "text-muted-foreground"
          }`}
        />
        {t("expenses")}
      </button>
      <button
        onClick={() => onTransactionTypeChange("income")}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold transition-all duration-200 ${
          transactionType === "income"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <ArrowDownCircleIcon
          className={`h-4 w-4 ${
            transactionType === "income"
              ? "text-green-600"
              : "text-muted-foreground"
          }`}
        />
        {t("income")}
      </button>
    </div>
  );
};
export default TransactionTypeFilter;
