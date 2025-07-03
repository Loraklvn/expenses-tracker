"use client";

import ConfirmationModal from "@/components/common/ConfirmationModal";
import {
  deleteTransactionClient,
  fetchTransactionsClient,
  FetchTransactionsResult,
  updateTransactionClient,
} from "@/lib/supabase/request/client";
import { TransactionWithDetails } from "@/types";
import debounce from "@/utils/debounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EditTransactionFormModal from "../EditTransactionFormModal";
import TransactionsHeader from "../TransactionsHeader";
import TransactionsList from "../TransactionsList";
import TransactionsPagination from "../TransactionsPagination";

const emptyFormData = {
  id: 0,
  description: "",
  amount: "",
  transaction_date: "",
};

interface TransactionsProps {
  defaultTransactions: TransactionWithDetails[];
  defaultTotal: number;
}

export default function Transactions({
  defaultTransactions,
  defaultTotal,
}: TransactionsProps) {
  const t = useTranslations("transactions");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermDebounced, setSearchTermDebounced] = useState("");

  const pageSize = 10;
  const [page, setPage] = useState(1);
  const { data, refetch } = useQuery<FetchTransactionsResult>({
    queryKey: ["transactions", page, pageSize, searchTermDebounced],
    queryFn: () => fetchTransactionsClient(page, pageSize, searchTermDebounced),
    initialData: {
      transactions: defaultTransactions,
      total: defaultTotal,
    },
  });

  const { mutate: updateTransaction } = useMutation({
    mutationFn: updateTransactionClient,
    onSuccess: () => {
      toast.success("Transaction updated successfully!");
      refetch();
      resetForm();
      setTransactionToEdit(null);
      setShowEditTransaction(false);
    },
    onError: () => {
      toast.error("Failed to update transaction");
    },
  });

  const { mutate: deleteTransaction } = useMutation({
    mutationFn: deleteTransactionClient,
    onSuccess: () => {
      toast.success("Transaction deleted successfully!");
      refetch();
      setTransactionToDelete(null);
      setShowDeleteConfirm(false);
    },
    onError: () => {
      toast.error("Failed to delete transaction");
      refetch();
    },
  });

  const transactions = data?.transactions ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  const [showEditTransaction, setShowEditTransaction] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<TransactionWithDetails | null>(null);
  const [transactionToDelete, setTransactionToDelete] =
    useState<TransactionWithDetails | null>(null);
  const [formData, setFormData] = useState(emptyFormData);

  // Reset to first page when filters, sort or pageSize change
  useEffect(() => {
    setPage(1);
  }, [searchTermDebounced, pageSize]);

  const resetForm = () => {
    setFormData(emptyFormData);
  };

  const editTransaction = () => {
    updateTransaction({
      transactionId: formData.id,
      updates: {
        description: formData.description,
        amount: Number.parseFloat(formData.amount),
        transaction_date: formData.transaction_date,
      },
    });
  };

  const confirmDelete = (transaction: TransactionWithDetails) => {
    setTransactionToDelete(transaction);
    setShowDeleteConfirm(true);
  };

  const handleDeleteTransaction = () => {
    if (!transactionToDelete) return;

    deleteTransaction({
      transactionId: transactionToDelete.id,
    });
  };

  const openEditDialog = (transaction: TransactionWithDetails) => {
    setTransactionToEdit(transaction);
    setFormData({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount.toString(),
      transaction_date: transaction.transaction_date,
    });
    setShowEditTransaction(true);
  };

  const groupTransactionsByDate = (transactions: TransactionWithDetails[]) => {
    const grouped = transactions.reduce((acc, transaction) => {
      const date = transaction.transaction_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {} as Record<string, TransactionWithDetails[]>);

    return Object.entries(grouped).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="space-y-4">
          {/* Search Bar */}
          <TransactionsHeader
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              debounce(() => setSearchTermDebounced(value), 500);
            }}
            total={total}
          />

          {/* Transactions List */}
          <TransactionsList
            groupedTransactions={groupedTransactions}
            searchTerm={searchTerm}
            onClearSearch={() => setSearchTerm("")}
            onEditTransaction={openEditDialog}
            onDeleteTransaction={confirmDelete}
          />

          <TransactionsPagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </div>

        <EditTransactionFormModal
          visible={showEditTransaction}
          onClose={() => setShowEditTransaction(false)}
          formData={formData}
          transactionToEdit={transactionToEdit}
          onChange={(field, value) =>
            setFormData((prev) => ({ ...prev, [field]: value }))
          }
          onSubmit={editTransaction}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmationModal
          visible={showDeleteConfirm}
          title={
            t("delete_transaction") +
            " " +
            `"${transactionToDelete?.description}"`
          }
          description={t("delete_transaction_confirmation")}
          confirmButtonText={t("delete")}
          cancelButtonText={t("cancel")}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteTransaction}
        />
      </div>
    </div>
  );
}
