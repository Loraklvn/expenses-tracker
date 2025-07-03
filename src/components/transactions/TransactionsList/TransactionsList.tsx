import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { TransactionWithDetails } from "@/types";
import { formatCurrency } from "@/utils/numbers";
import { formatDateToReadable } from "@/utils/date";

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
  return (
    <div className="space-y-4">
      {groupedTransactions.length > 0 ? (
        groupedTransactions.map(([date, dayTransactions]) => (
          <div key={date}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              {formatDateToReadable(date)}
            </h3>
            <div className="space-y-1">
              {dayTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-3 px-1 border-b border-border/50 last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          transaction.type === "expense"
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium text-base">
                          {transaction.expense_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.description || "No description"} •{" "}
                          {transaction.expense_id}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {transaction.budget_name}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatCurrency(transaction.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEditTransaction(transaction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteTransaction(transaction)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "No transactions found matching your filters"
              : "No transactions yet"}
          </p>
          {searchTerm ? (
            <Button
              variant="outline"
              onClick={() => {
                onClearSearch();
              }}
            >
              Clear filters
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
