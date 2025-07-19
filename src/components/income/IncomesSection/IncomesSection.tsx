"use client";
import useManageIncomeSources from "@/hooks/useManageIncomeSources";
import useManageIncomeTransactions from "@/hooks/useManageIncomeTransactions";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import AddIncomeForm from "../AddIncomeForm";
import IncomeSummaryCard from "../IncomeSummaryCard";
import RecentIncomesList from "../RecentIncomesList";
import { Transaction } from "@/types";
import ConfirmationModal from "@/components/common/ConfirmationModal/ConfirmationModal";

export default function IncomesSection() {
  const t = useTranslations("income");
  const {
    transactions,
    createMutation,
    deleteMutation,
    isLoading: isCreatingIncome,
  } = useManageIncomeTransactions();

  const { incomeSources = [] } = useManageIncomeSources();

  const [newIncomeForm, setNewIncomeForm] = useState({
    description: "",
    amount: "",
    incomeSourceId: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const totalIncomeThisMonth = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.transaction_date);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [transactions]);

  const handleAddIncome = async () => {
    if (
      !newIncomeForm.description ||
      !newIncomeForm.amount ||
      !newIncomeForm.incomeSourceId
    ) {
      toast.error(t("please_fill_required_fields"));
      return;
    }

    try {
      await createMutation.mutateAsync({
        incomeSourceId: Number(newIncomeForm.incomeSourceId),
        amount: Number.parseFloat(newIncomeForm.amount),
        description: newIncomeForm.description,
      });

      // Reset form
      setNewIncomeForm({
        description: "",
        amount: "",
        incomeSourceId: "",
      });

      toast.success(t("income_added_successfully"));
    } catch (error) {
      console.error("Error adding income:", error);
      toast.error(t("failed_to_add_income"));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return;

    await deleteMutation.mutateAsync({ transactionId: transactionToDelete.id });
    setShowDeleteConfirm(false);
    setTransactionToDelete(null);
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="space-y-6">
      {/* Income Summary */}
      <IncomeSummaryCard
        totalIncomeThisMonth={totalIncomeThisMonth}
        transactions={transactions}
      />

      {/* Add Income Form */}
      <AddIncomeForm
        formValues={newIncomeForm}
        onChange={(field, value) =>
          setNewIncomeForm({ ...newIncomeForm, [field]: value })
        }
        incomeSources={incomeSources}
        isCreatingIncome={isCreatingIncome}
        onSubmit={handleAddIncome}
      />

      {/* Income History */}
      <div>
        <RecentIncomesList
          transactions={transactions}
          incomeSources={incomeSources}
          onDeleteClick={handleDeleteClick}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteConfirm}
        title={
          t("delete_income") + " " + `"${transactionToDelete?.description}"`
        }
        description={t("delete_income_confirmation")}
        confirmButtonText={t("delete")}
        cancelButtonText={t("cancel")}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
