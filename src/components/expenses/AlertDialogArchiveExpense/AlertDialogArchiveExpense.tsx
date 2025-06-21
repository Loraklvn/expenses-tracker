import React, { ReactElement } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

type AlertDialogArchiveExpenseProps = {
  isVisible: boolean;
  onClose: () => void;
  expenseName: string;
  onArchive: () => void;
};

const AlertDialogArchiveExpense = ({
  isVisible,
  onClose,
  expenseName,
  onArchive,
}: AlertDialogArchiveExpenseProps): ReactElement => {
  const t = useTranslations("manage_expenses");
  return (
    <AlertDialog open={isVisible} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("archive_expense", { expenseName })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("archive_expense_confirmation", { expenseName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onArchive}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("archive")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default AlertDialogArchiveExpense;
