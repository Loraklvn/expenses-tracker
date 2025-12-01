"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MonthPicker } from "@/components/ui/month-picker";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { getLastDayOfMonthDate } from "@/utils/date";

type DateRangeFilterProps = {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
};

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFilterProps) {
  const t = useTranslations("analytics");
  const hasFilter = startDate || endDate;

  const handleStartSelect = (date: Date) => {
    // MonthPicker already creates a date for the first day of the month
    onStartDateChange(date);
  };

  const handleEndSelect = (date: Date) => {
    // Get the last day of the selected month
    const lastDay = getLastDayOfMonthDate(date.getFullYear(), date.getMonth());
    onEndDateChange(lastDay);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-semibold">{t("date_range")}</Label>
          {hasFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Clear dates to undefined
                onStartDateChange(undefined);
                onEndDateChange(undefined);
              }}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              {t("clear")}
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <MonthPicker
            date={startDate}
            onSelect={handleStartSelect}
            label={t("start_date")}
          />
          <MonthPicker
            date={endDate}
            onSelect={handleEndSelect}
            label={t("end_date")}
          />
        </div>
        {!hasFilter && (
          <p className="text-xs text-muted-foreground mt-2">
            {t("date_range_hint")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
