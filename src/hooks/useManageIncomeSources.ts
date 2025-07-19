import {
  fetchIncomeSourcesClient,
  createIncomeSourceClient,
  updateIncomeSourceClient,
  archiveIncomeSourceClient,
} from "@/lib/supabase/request/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

const useManageIncomeSources = () => {
  const t = useTranslations("common");
  const {
    data: incomeSources,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["income-sources"],
    queryFn: () => fetchIncomeSourcesClient(),
  });

  const onSuccess = () => {
    toast.success(t("operation_successful"));
    refetch();
  };
  const onError = () => toast.error(t("something_went_wrong"));

  const add = useMutation({
    mutationFn: createIncomeSourceClient,
    onSuccess,
    onError,
  });
  const edit = useMutation({
    mutationFn: updateIncomeSourceClient,
    onSuccess,
    onError,
  });

  const archive = useMutation({
    mutationFn: archiveIncomeSourceClient,
    onSuccess,
    onError,
  });

  const isLoading =
    add.isPending || edit.isPending || archive.isPending || loading;

  return {
    incomeSources,
    add,
    edit,
    archive,
    refetch,
    isLoading,
  };
};

export default useManageIncomeSources;
