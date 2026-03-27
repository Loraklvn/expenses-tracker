import { EditBudgetFormData } from "@/components/budget/EditBudgetFormModal";
import {
  fetchBudgetClient,
  updateBudgetClient,
} from "@/lib/supabase/request/client";
import { BudgetWithCurrent } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

const emptyBudgetFormData: EditBudgetFormData = {
  name: "",
  expectedAmount: "",
  startDate: "",
  endDate: "",
};

type UseEditBudgetProps = {
  budget: BudgetWithCurrent | null;
  onErrorMessage: string;
};

const useEditBudget = ({ budget, onErrorMessage }: UseEditBudgetProps) => {
  const { data: budgetData = null, refetch: refetchBudget } = useQuery({
    queryKey: ["budget", budget?.id],
    queryFn: async () => fetchBudgetClient(budget?.id || 0),
    initialData: budget,
    enabled: !!budget?.id,
  });

  const [showEditBudget, setShowEditBudget] = useState(false);
  const [budgetForm, setBudgetForm] =
    useState<EditBudgetFormData>(emptyBudgetFormData);

  const updateBudgetMutation = useMutation({
    mutationFn: updateBudgetClient,
    onSuccess: () => {
      refetchBudget();
      handleCloseEditBudget();
    },
    onError: (err) => {
      console.log({ err });
      toast.error(onErrorMessage);
    },
  });

  const isBudgetDateRangeInvalid =
    !!budgetForm.startDate &&
    !!budgetForm.endDate &&
    new Date(budgetForm.endDate).getTime() <
      new Date(budgetForm.startDate).getTime();
  const isBudgetFormValid =
    !!budgetForm.name.trim() &&
    !!budgetForm.startDate &&
    !!budgetForm.endDate &&
    !Number.isNaN(Number.parseFloat(budgetForm.expectedAmount)) &&
    Number.parseFloat(budgetForm.expectedAmount) > 0 &&
    !isBudgetDateRangeInvalid;
  const hasBudgetChanges =
    budgetForm.name !== (budgetData?.name || "") ||
    budgetForm.expectedAmount !==
      (budgetData?.expected_amount?.toString() || "") ||
    budgetForm.startDate !== (budgetData?.start_date || "") ||
    budgetForm.endDate !== (budgetData?.end_date || "");
  const isBudgetUpdateDisabled = !isBudgetFormValid || !hasBudgetChanges;

  const handleOpenEditBudget = () => {
    if (!budgetData) return;
    setBudgetForm({
      name: budgetData.name || "",
      expectedAmount: budgetData.expected_amount?.toString() || "",
      startDate: budgetData.start_date || "",
      endDate: budgetData.end_date || "",
    });
    setShowEditBudget(true);
  };

  const handleCloseEditBudget = () => {
    setShowEditBudget(false);
    setBudgetForm(emptyBudgetFormData);
  };

  const handleUpdateBudget = async () => {
    if (!budgetData || isBudgetUpdateDisabled) return;
    updateBudgetMutation.mutate({
      budgetId: budgetData.id,
      updates: {
        name: budgetForm.name.trim(),
        expectedAmount: Number.parseFloat(budgetForm.expectedAmount),
        startDate: budgetForm.startDate,
        endDate: budgetForm.endDate,
      },
    });
  };

  return {
    budgetData,
    showEditBudget,
    budgetForm,
    isUpdatingBudget: updateBudgetMutation.isPending,
    isBudgetUpdateDisabled,
    setBudgetForm,
    handleOpenEditBudget,
    handleCloseEditBudget,
    handleUpdateBudget,
  };
};

export default useEditBudget;
