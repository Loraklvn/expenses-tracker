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
import { MONTH_KEYS } from "@/utils/constants";
import { MonthlyFlowData } from "@/lib/supabase/request/client";

type MonthlyFlowDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: MonthlyFlowData[];
};

export default function MonthlyFlowDetailsModal({
  open,
  onOpenChange,
  data,
}: MonthlyFlowDetailsModalProps) {
  const t = useTranslations("analytics");
  const tDate = useTranslations("date");

  // Format data for table display
  const tableData = [...data].reverse().map((item) => {
    const [year, month] = item.month_start.split("-").map(Number);
    const monthKey = MONTH_KEYS[month - 1]; // month is 1-indexed
    const monthName = `${tDate("long_months." + monthKey)} ${year}`;
    const netFlow = item.total_income - item.total_spending;

    return {
      monthName,
      month_start: item.month_start,
      income: item.total_income,
      spending: item.total_spending,
      netFlow,
    };
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("income_vs_spending_history")}</DialogTitle>
          <DialogDescription>
            {t("full_list_description") || "Complete breakdown of all months"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          <div className="space-y-2">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-3 rounded-lg bg-muted/50 border-b border-border font-semibold text-sm sticky top-0 z-10">
              <div>{t("month") || "Month"}</div>
              <div className="text-right">{t("income")}</div>
              <div className="text-right">{t("spending")}</div>
              <div className="text-right">{t("net_flow")}</div>
            </div>

            {/* Table Rows */}
            {tableData.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 p-3 rounded-lg bg-card border border-border/50 hover:bg-accent/30 transition-colors"
              >
                <div className="font-medium text-sm">{item.monthName}</div>
                <div className="text-right text-sm font-semibold text-emerald-600">
                  {formatCurrency(item.income, { minimumFractionDigits: 0 })}
                </div>
                <div className="text-right text-sm font-semibold text-rose-600">
                  {formatCurrency(item.spending, { minimumFractionDigits: 0 })}
                </div>
                <div
                  className={`text-right text-sm font-semibold ${
                    item.netFlow >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {item.netFlow >= 0 ? "+" : ""}
                  {formatCurrency(Math.abs(item.netFlow), {
                    minimumFractionDigits: 0,
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
