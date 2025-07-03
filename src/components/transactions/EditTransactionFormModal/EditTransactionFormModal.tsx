"use client";

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
import { CalendarIcon, DollarSignIcon } from "lucide-react";

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
  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit TransactionWithDetails</DialogTitle>
          <DialogDescription>Update the transaction details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Input
              id="edit-description"
              placeholder="e.g., Gas station fill-up"
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount</Label>
            <div className="relative">
              <DollarSignIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
            <Label htmlFor="edit-date">Date *</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
              <p>Expense: {transactionToEdit.expense_name}</p>
              <p>Category: {transactionToEdit.category_name}</p>
              <p>Budget: {transactionToEdit.budget_name}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={!formData.amount || !formData.transaction_date}
          >
            Update Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionFormModal;
