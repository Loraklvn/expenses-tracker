"use client";
import ConfirmationModal from "@/components/common/ConfirmationModal/ConfirmationModal";
import { Button } from "@/components/ui/button";
import useManageIncomeSources from "@/hooks/useManageIncomeSources";
import useManageIncomeTransactions from "@/hooks/useManageIncomeTransactions";
import { Transaction } from "@/types";
import { Settings, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import AddIncomeModal from "../AddIncomeModal";
import IncomeSummaryCard from "../IncomeSummaryCard";
import RecentIncomesList from "../RecentIncomesList";

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
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
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
    if (!newIncomeForm.amount || !newIncomeForm.incomeSourceId) {
      toast.error(t("please_fill_required_fields"));
      return;
    }

    try {
      await createMutation.mutateAsync({
        incomeSourceId: Number(newIncomeForm.incomeSourceId),
        amount: Number.parseFloat(newIncomeForm.amount),
        description: newIncomeForm.description,
      });

      // Reset form and close modal
      setNewIncomeForm({
        description: "",
        amount: "",
        incomeSourceId: "",
      });
      setShowAddIncomeModal(false);
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

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          className="flex-1 rounded-xl h-11 px-6 font-semibold shadow-sm"
          onClick={() => setShowAddIncomeModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("add_income")}
        </Button>
        <Link href="/income-sources" className="flex-1">
          <Button
            variant="outline"
            className="w-full rounded-xl h-11 px-6 font-semibold border-border/50"
          >
            <Settings className="h-4 w-4 mr-2" />
            {t("sources")}
          </Button>
        </Link>
      </div>

      {/* Income History */}
      <RecentIncomesList
        transactions={transactions}
        incomeSources={incomeSources}
        onDeleteClick={handleDeleteClick}
      />

      {/* Add Income Modal */}
      <AddIncomeModal
        visible={showAddIncomeModal}
        formValues={newIncomeForm}
        onChange={(field, value) =>
          setNewIncomeForm({ ...newIncomeForm, [field]: value })
        }
        incomeSources={incomeSources}
        isCreatingIncome={isCreatingIncome}
        onSubmit={handleAddIncome}
        onClose={() => {
          setShowAddIncomeModal(false);
          setNewIncomeForm({
            description: "",
            amount: "",
            incomeSourceId: "",
          });
        }}
      />

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
