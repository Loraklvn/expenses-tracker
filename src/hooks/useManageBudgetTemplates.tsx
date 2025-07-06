import {
  createBudgetTemplateClient,
  deleteBudgetTemplateClient,
  fetchBudgetTemplatesClient,
  updateBudgetTemplateClient,
} from "@/lib/supabase/request/client";
import { BudgetTemplateWithStats } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useManageBudgetTemplates = ({
  defaultBudgetTemplates,
}: {
  defaultBudgetTemplates: BudgetTemplateWithStats[];
}) => {
  const { data: budgetTemplates = [], refetch } = useQuery({
    queryKey: ["budget-templates"],
    queryFn: fetchBudgetTemplatesClient,
    initialData: defaultBudgetTemplates,
  });

  const onSuccess = () => {
    toast.success("Operation succeeded");
    refetch();
  };
  const onError = () => {
    toast.error("Operation failed");
  };

  const add = useMutation({
    mutationFn: createBudgetTemplateClient,
    onSuccess,
    onError,
  });
  const update = useMutation({
    mutationFn: updateBudgetTemplateClient,
    onSuccess,
    onError,
  });
  const remove = useMutation({
    mutationFn: deleteBudgetTemplateClient,
    onSuccess,
    onError,
  });

  return {
    budgetTemplates,
    add,
    update,
    remove,
  };
};

export default useManageBudgetTemplates;
