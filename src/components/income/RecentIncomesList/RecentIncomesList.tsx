import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IncomeSource, Transaction } from "@/types";
import { formatDateToReadable } from "@/utils/date";
import { formatCurrency } from "@/utils/numbers";
import { Settings, Trash2, TrendingUpIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{t("recent_income")}</h2>
        <Link href="/income-sources" className="flex items-center gap-2">
          <Settings className="h-4 w-4 mr-1" />
          {t("manage_income_sources")}
        </Link>
      </div>

      <div className="space-y-3">
        {transactions.slice(0, 10).map((transaction) => {
          const incomeSource = incomeSources?.find(
            (source) => source.id === transaction.income_source_id
          );
          return (
            <Card key={transaction.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {incomeSource?.name || t("unknown_source")} •{" "}
                        {formatDateToReadable(transaction.transaction_date)}
                      </p>
                      {incomeSource?.description && (
                        <p className="text-xs text-muted-foreground">
                          {incomeSource.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    {onDeleteClick && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteClick(transaction)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {transactions.length === 0 && (
          <div className="text-center py-12">
            <TrendingUpIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
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
