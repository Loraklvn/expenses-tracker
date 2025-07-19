import {
  archiveCategoryClient,
  createCategoryClient,
  fetchCategoriesClient,
  updateCategoryClient,
} from "@/lib/supabase/request/client";
import { Category } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

const useManageCategories = ({
  defaultCategories,
}: {
  defaultCategories: Category[];
}) => {
  const t = useTranslations("common");
  const {
    data: categories,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategoriesClient({ type: "all" }),
    initialData: defaultCategories,
  });

  const onSuccess = () => {
    refetch();
  };
  const onError = () => toast.error(t("something_went_wrong"));

  const add = useMutation({
    mutationFn: createCategoryClient,
    onSuccess,
    onError,
  });
  const edit = useMutation({
    mutationFn: updateCategoryClient,
    onSuccess,
    onError,
  });

  const archive = useMutation({
    mutationFn: archiveCategoryClient,
    onSuccess,
    onError,
  });

  const isLoading =
    add.isPending || edit.isPending || archive.isPending || loading;

  return {
    categories,
    add,
    edit,
    archive,
    refetch,
    isLoading,
  };
};

export default useManageCategories;
