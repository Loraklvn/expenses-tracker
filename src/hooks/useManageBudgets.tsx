import {
  deleteBudgetClient,
  fetchBudgetsClient,
} from "@/lib/supabase/request/client";
import { BudgetWithCurrent } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

const useManageBudgets = ({
  defaultBudgets,
}: {
  defaultBudgets: BudgetWithCurrent[];
}) => {
  const t = useTranslations("budget_list");

  const { data: budgets = [], refetch } = useQuery({
    queryKey: ["budgets"],
    queryFn: fetchBudgetsClient,
    initialData: defaultBudgets,
  });

  const onSuccess = () => {
    refetch();
  };

  const onError = () => {
    toast.error(t("failed_to_delete_budget"));
  };

  const remove = useMutation({
    mutationFn: deleteBudgetClient,
    onSuccess,
    onError,
  });

  return {
    budgets,
    remove,
  };
};

export default useManageBudgets;
