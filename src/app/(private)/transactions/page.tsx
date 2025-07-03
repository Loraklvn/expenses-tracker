import TransactionsShell from "@/components/transactions/TransactionsShell";
import { fetchTransactionsServer } from "@/lib/supabase/request/server";
import React, { ReactElement } from "react";

const TransactionsPage = async (): Promise<ReactElement> => {
  const { transactions, total } = await fetchTransactionsServer();

  return (
    <TransactionsShell
      defaultTransactions={transactions || []}
      defaultTotal={total}
    />
  );
};
export default TransactionsPage;
