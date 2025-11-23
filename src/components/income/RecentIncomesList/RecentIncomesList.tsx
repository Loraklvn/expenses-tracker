import { IncomeSource, Transaction } from "@/types";
import { TrendingUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import IncomeItem from "../IncomeItem";

interface RecentIncomesListProps {
  transactions: Transaction[];
  incomeSources: IncomeSource[];
  onDeleteClick: (transaction: Transaction) => void;
}

const RecentIncomesList = ({
  transactions,
  incomeSources,
  onDeleteClick,
}: RecentIncomesListProps) => {
  const t = useTranslations("income");

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold">{t("recent_transactions")}</h2>
        <Link
          href="/transactions"
          className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          {t("see_all")}
        </Link>
      </div>

      <div className="space-y-2">
        {transactions.length > 0 ? (
          transactions
            .slice(0, 10)
            .map((transaction) => (
              <IncomeItem
                key={transaction.id}
                transaction={transaction}
                incomeSource={
                  incomeSources.find(
                    (source) => source.id === transaction.income_source_id
                  ) as IncomeSource
                }
                onDeleteClick={onDeleteClick}
              />
            ))
        ) : (
          <div className="text-center py-16">
            <TrendingUpIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2 text-base">
              {t("no_income_recorded")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("add_first_income")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentIncomesList;
