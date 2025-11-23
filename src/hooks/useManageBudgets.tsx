import {
  deleteBudgetClient,
  fetchBudgetsClient,
} from "@/lib/supabase/request/client";
import { BudgetWithCurrent } from "@/types";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

type UseManageBudgetsProps = {
  defaultBudgets: BudgetWithCurrent[];
  filters?: {
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };
};

const PAGE_SIZE = 10;

const useManageBudgets = ({
  defaultBudgets,
  filters,
}: UseManageBudgetsProps) => {
  const t = useTranslations("budget_list");

  console.log({ filters });

  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["budgets", filters],
      queryFn: ({ pageParam = 1 }) =>
        fetchBudgetsClient({
          ...filters,
          page: pageParam,
          pageSize: PAGE_SIZE,
        }),
      getNextPageParam: (lastResponse) =>
        lastResponse.total >
        (lastResponse.page || 1) * (lastResponse.pageSize || 10)
          ? (lastResponse.page || 1) + 1
          : undefined,
      initialPageParam: 1,
      initialData: {
        pages: [
          {
            budgets: defaultBudgets,
            total: defaultBudgets.length,
            page: 1,
            pageSize: PAGE_SIZE,
          },
        ],
        pageParams: [1],
      },
    });
  const budgets = data?.pages.flatMap((page) => page.budgets) || [];

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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useManageBudgets;
