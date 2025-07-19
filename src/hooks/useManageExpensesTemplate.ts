import {
  fetchExpensesTemplateClient,
  fetchCategoriesClient,
  postExpenseTemplateClient,
  updateExpenseTemplateClient,
  archiveExpenseTemplateClient,
} from "@/lib/supabase/request/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useManageExpensesTemplate = () => {
  const { data: expenseTemplates = [], refetch } = useQuery({
    queryKey: ["expenseTemplates"],
    queryFn: fetchExpensesTemplateClient,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategoriesClient(),
  });

  const onSuccess = () => {
    refetch();
  };
  const onError = () => toast.error("Something went wrong");

  const add = useMutation({
    mutationKey: ["addExpenseTemplate"],
    mutationFn: postExpenseTemplateClient,
    onSuccess,
    onError,
  });

  // Mutation for editing expense templates
  const edit = useMutation({
    mutationKey: ["editExpenseTemplate"],
    mutationFn: updateExpenseTemplateClient,
    onSuccess,
    onError,
  });
  // Mutation for archiving expense templates
  const archive = useMutation({
    mutationKey: ["archiveExpense"],
    mutationFn: archiveExpenseTemplateClient,
    onSuccess,
    onError,
  });

  const isLoading = add.isPending || edit.isPending || archive.isPending;

  return { expenseTemplates, categories, add, edit, archive, isLoading };
};

export default useManageExpensesTemplate;
