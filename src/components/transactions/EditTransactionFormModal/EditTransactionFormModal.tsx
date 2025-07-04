import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TransactionWithDetails } from "@/types";
import { useTranslations } from "next-intl";

type EditTransactionFormModalProps = {
  visible: boolean;
  onClose: () => void;
  formData: {
    id: number;
    description: string;
    amount: string;
    transaction_date: string;
  };
  transactionToEdit: TransactionWithDetails | null;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
};
const EditTransactionFormModal = ({
  visible,
  transactionToEdit,
  onClose,
  formData,
  onChange,
  onSubmit,
}: EditTransactionFormModalProps) => {
  const t = useTranslations("transactions");
  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("edit_transaction")}</DialogTitle>
          <DialogDescription>
            {t("update_transaction_details")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-description">{t("description")}</Label>
            <Input
              id="edit-description"
              placeholder={t("description_placeholder")}
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-amount">{t("amount")}</Label>
            <div className="relative">
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => onChange("amount", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date">{t("date")} *</Label>
            <div className="relative">
              <Input
                id="edit-date"
                type="date"
                value={formData.transaction_date}
                onChange={(e) => onChange("transaction_date", e.target.value)}
              />
            </div>
          </div>
          {transactionToEdit && (
            <div className="text-sm text-muted-foreground">
              <p>
                {t("expense")}: {transactionToEdit.expense_name}
              </p>
              <p>
                {t("category")}: {transactionToEdit.category_name}
              </p>
              <p>
                {t("budget")}: {transactionToEdit.budget_name}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={!formData.amount || !formData.transaction_date}
          >
            {t("update_transaction")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionFormModal;
