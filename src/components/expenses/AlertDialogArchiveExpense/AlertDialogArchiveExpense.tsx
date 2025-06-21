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
  return (
    <AlertDialog open={isVisible} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive Expense Template</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to archive &quot;{expenseName}
            &quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onArchive}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Archive
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default AlertDialogArchiveExpense;
