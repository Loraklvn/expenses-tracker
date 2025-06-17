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
import { ExpenseWithCurrent } from "@/types";

import { DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { ReactElement } from "react";
import { toast } from "react-toastify";

type AddTransactionModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedExpense: ExpenseWithCurrent | null;
  refetch: () => void;
};

const AddTransactionModal = ({
  selectedExpense,
  visible,
  onClose,
  refetch,
}: AddTransactionModalProps): ReactElement => {
  const t = useTranslations("expenses");
  const [transactionAmount, setTransactionAmount] = React.useState("");

  const handleAddTransaction = async () => {
    if (!selectedExpense || !transactionAmount) return;

    try {
      await addTransactionClient(
        selectedExpense.id,
        parseFloat(transactionAmount),
        undefined // You can add a description if needed
      );
      refetch(); // Refetch expenses to update the list
      setTransactionAmount("");
      onClose(); // Close the modal
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
                type="number"
                step="0.01"
                placeholder="0.00"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleAddTransaction}
            disabled={!transactionAmount}
          >
            {t("add_transaction")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddTransactionModal;
