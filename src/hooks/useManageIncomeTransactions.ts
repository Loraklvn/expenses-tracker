import {
  createIncomeTransactionClient,
  deleteTransactionClient,
  fetchIncomeTransactionsClient,
  updateTransactionClient,
} from "@/lib/supabase/request/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

const useManageIncomeTransactions = () => {
  const t = useTranslations("common");
  const pageSize = 10;

  const {
    data: { transactions, total } = { transactions: [], total: 0 },
    refetch,
  } = useQuery({
    queryKey: ["income-transactions"],
    queryFn: () => fetchIncomeTransactionsClient({ page: 1, pageSize }),
  });

  const onSuccess = () => {
    refetch();
  };

  const onError = () => {
    toast.error(t("operation_failed"));
  };

  const createMutation = useMutation({
    mutationFn: createIncomeTransactionClient,
    onSuccess,
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: updateTransactionClient,
    onSuccess,
    onError,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransactionClient,
    onSuccess,
    onError,
  });

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return {
    transactions,
    total,
    createMutation,
    updateMutation,
    deleteMutation,
    refetch,
    isLoading,
  };
};

export default useManageIncomeTransactions;
