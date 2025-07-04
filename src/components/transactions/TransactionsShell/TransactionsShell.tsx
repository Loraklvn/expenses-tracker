"use client";

import ConfirmationModal from "@/components/common/ConfirmationModal";
import useManageTransactions from "@/hooks/useManageTransactions";
import { TransactionWithDetails } from "@/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
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
  const {
    transactions,
    total,
    totalPages,
    onSearchChange,
    searchTerm,
    page,
    setPage,
    updateMutation,
    deleteMutation,
  } = useManageTransactions({
    defaultTransactions,
    defaultTotal,
  });

  const [showEditTransaction, setShowEditTransaction] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [transactionToEdit, setTransactionToEdit] =
    useState<TransactionWithDetails | null>(null);
  const [transactionToDelete, setTransactionToDelete] =
    useState<TransactionWithDetails | null>(null);
  const [formData, setFormData] = useState(emptyFormData);

  const editTransaction = async () => {
    await updateMutation.mutateAsync({
      transactionId: formData.id,
      updates: {
        description: formData.description,
        amount: Number.parseFloat(formData.amount),
        transaction_date: formData.transaction_date,
      },
    });
    setShowEditTransaction(false);
    setFormData(emptyFormData);
    setTransactionToEdit(null);
  };

  const confirmDelete = (transaction: TransactionWithDetails) => {
    setTransactionToDelete(transaction);
    setShowDeleteConfirm(true);
  };

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;
    await deleteMutation.mutateAsync({
      transactionId: transactionToDelete.id,
    });
    setShowDeleteConfirm(false);
    setTransactionToDelete(null);
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
            onSearchChange={onSearchChange}
            total={total}
          />

          {/* Transactions List */}
          <TransactionsList
            groupedTransactions={groupedTransactions}
            searchTerm={searchTerm}
            onClearSearch={() => {
              onSearchChange("");
            }}
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
