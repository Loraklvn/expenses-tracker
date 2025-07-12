import React, { ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type EditBudgetExpenseFormModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: {
    name: string;
    description: string;
    amount: string;
  };
  onChange: (key: string, value: string) => void;
  disabledUpdate: boolean;
  disabledName: boolean;
};

const EditBudgetExpenseFormModal = ({
  visible,
  onClose,
  onSubmit,
  formData,
  onChange,
  disabledName,
  disabledUpdate,
}: EditBudgetExpenseFormModalProps): ReactElement => {
  const t = useTranslations("expenses");

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("edit_expense")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder={t("enter_expense_name")}
              disabled={disabledName}
            />
          </div>
          <div>
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder={t("enter_description")}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="amount">{t("amount")}</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => onChange("amount", e.target.value)}
              placeholder={t("enter_amount")}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={onSubmit} disabled={disabledUpdate}>
            {t("update")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default EditBudgetExpenseFormModal;
