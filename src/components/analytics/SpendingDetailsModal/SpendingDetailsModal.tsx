"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/utils/numbers";

type SpendingItem = {
  name: string;
  value: number;
  color?: string;
};

type SpendingDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  data: SpendingItem[];
};

export default function SpendingDetailsModal({
  open,
  onOpenChange,
  title,
  data,
}: SpendingDetailsModalProps) {
  const t = useTranslations("analytics");

  // Calculate total for percentage calculation
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {t("full_list_description") || "Complete breakdown of all items"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          <div className="space-y-2">
            {data.map((item, index) => {
              const percentage = total > 0 ? (item.value / total) * 100 : 0;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {item.color && (
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                    <span className="font-medium text-sm truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-3">
                    <span className="text-sm font-semibold">
                      {formatCurrency(item.value)}
                    </span>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
