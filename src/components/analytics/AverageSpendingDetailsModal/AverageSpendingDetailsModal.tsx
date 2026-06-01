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
import { AverageSpendingChartItem } from "@/utils/dashboard";

type AverageSpendingDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  data: AverageSpendingChartItem[];
};

export default function AverageSpendingDetailsModal({
  open,
  onOpenChange,
  title,
  data,
}: AverageSpendingDetailsModalProps) {
  const t = useTranslations("analytics");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{t("full_list_description")}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          <div className="space-y-2">
            {data.map((item, index) => (
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
                <div className="flex flex-col items-end flex-shrink-0 ml-3">
                  <span className="text-sm font-semibold">
                    {formatCurrency(item.value)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t("across_months", { count: item.count })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
