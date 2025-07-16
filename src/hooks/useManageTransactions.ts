import {
  deleteTransactionClient,
  FetchTransactionsResult,
  fetchTransactionsClient,
  updateTransactionClient,
} from "@/lib/supabase/request/client";
import { TransactionWithDetails } from "@/types";
import debounce from "@/utils/debounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type UseManageTransactionsProps = {
  defaultTransactions: TransactionWithDetails[];
  defaultTotal: number;
};

const useManageTransactions = ({
  defaultTransactions,
  defaultTotal,
}: UseManageTransactionsProps) => {
  const t = useTranslations("common");
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermDebounced, setSearchTermDebounced] = useState("");
  const {
    data: { transactions, total },
    refetch,
  } = useQuery<FetchTransactionsResult>({
    queryKey: ["transactions", page, pageSize, searchTermDebounced],
    queryFn: () =>
      fetchTransactionsClient({
        page,
        pageSize,
        searchTerm: searchTermDebounced,
      }),
    initialData: {
      transactions: defaultTransactions,
      total: defaultTotal,
    },
  });
  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    setPage(1);
  }, [searchTermDebounced]);

  const onSuccess = () => {
    toast.success(t("operation_successful"));
    refetch();
  };

  const onError = () => {
    toast.error(t("operation_failed"));
  };

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

  const onSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    debounce(() => setSearchTermDebounced(searchTerm), 500);
  };

  return {
    transactions,
    total,
    totalPages,
    updateMutation,
    deleteMutation,
    onSearchChange,
    searchTerm,
    searchTermDebounced,
    page,
    setPage,
  };
};

export default useManageTransactions;
