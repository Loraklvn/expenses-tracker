import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addTransactionClient } from "@/lib/supabase/request/client";
import { BudgetWithCurrent, ExpenseWithCurrent } from "@/types";
import { getCurrentDateInYYYYMMDD } from "@/utils/date";

import { DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { ReactElement } from "react";
import { toast } from "react-toastify";

type AddTransactionModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedExpense: ExpenseWithCurrent | null;
  budget: BudgetWithCurrent | null;
  refetch: () => void;
};

const AddTransactionModal = ({
  selectedExpense,
  visible,
  onClose,
  budget,
  refetch,
}: AddTransactionModalProps): ReactElement => {
  const t = useTranslations("expenses");
  const [transactionAmount, setTransactionAmount] = React.useState("");
  const [transactionDescription, setTransactionDescription] =
    React.useState("");
  // Get current date in YYYY-MM-DD format for default value
  const [transactionDate, setTransactionDate] = React.useState(
    getCurrentDateInYYYYMMDD()
  );

  // Reset date to current date when modal opens
  React.useEffect(() => {
    if (visible) {
      setTransactionDate(getCurrentDateInYYYYMMDD());
      setTransactionAmount("");
      setTransactionDescription("");
    }
  }, [visible]);

  const handleAddTransaction = async () => {
    if (!selectedExpense || !transactionAmount) return;

    // Validate date is within budget range
    if (budget?.start_date && budget?.end_date) {
      const selectedDate = new Date(transactionDate);
      const startDate = new Date(budget.start_date);
      const endDate = new Date(budget.end_date);

      if (selectedDate < startDate || selectedDate > endDate) {
        toast.error(t("transaction_date_out_of_range"));
        return;
      }
    }

    try {
      await addTransactionClient(
        selectedExpense.id,
        parseFloat(transactionAmount),
        transactionDate,
        transactionDescription
      );
      refetch(); // Refetch expenses to update the list
      setTransactionAmount("");
      setTransactionDescription("");
      setTransactionDate(getCurrentDateInYYYYMMDD());
      onClose();
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error(
        t("error_adding_transaction", {
          error: error instanceof Error ? error.message : "Unknown error",
        })
      );
    }
  };

  return (
    <Dialog open={visible} onOpenChange={onClose} modal>
      <DialogContent className="sm:max-w-[425px] top-[22%] translate-y-0">
        <DialogHeader>
          <DialogTitle>{t("add_transaction")}</DialogTitle>
          <DialogDescription>
            {t("add_new_transaction_to", {
              expenseName: selectedExpense?.name || "Expense",
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">{t("amount")}</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="tel"
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="0.00"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Input
              id="description"
              placeholder={t("description_placeholder")}
              value={transactionDescription}
              onChange={(e) => setTransactionDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transaction-date">{t("date")} *</Label>
            <Input
              id="transaction-date"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              min={budget?.start_date || undefined}
              max={budget?.end_date || undefined}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleAddTransaction}
            disabled={!transactionAmount || !transactionDate}
          >
            {t("add_transaction")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddTransactionModal;
