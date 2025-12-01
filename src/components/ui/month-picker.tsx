"use client";

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type MonthPickerProps = {
  date?: Date;
  onSelect: (date: Date) => void;
  label: string;
};

const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

export function MonthPicker({ date, onSelect, label }: MonthPickerProps) {
  const tDate = useTranslations("date");
  const [open, setOpen] = React.useState(false);

  // Extract month and year from date (or use current if undefined)
  const month = date ? date.getMonth() : undefined;
  const year = date ? date.getFullYear() : undefined;

  const [displayYear, setDisplayYear] = React.useState(
    year ?? new Date().getFullYear()
  );

  // Update display year when year prop changes
  React.useEffect(() => {
    if (year !== undefined) {
      setDisplayYear(year);
    }
  }, [year]);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handleMonthSelect = (selectedMonth: number) => {
    // Create a date for the first day of the selected month/year
    const selectedDate = new Date(displayYear, selectedMonth, 1);
    onSelect(selectedDate);
    setOpen(false);
  };

  const handlePreviousYear = () => {
    setDisplayYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setDisplayYear((prev) => prev + 1);
  };

  const getDisplayText = () => {
    if (month !== undefined && year !== undefined) {
      return `${tDate("long_months." + MONTHS[month])} ${year}`;
    }
    return tDate("select_month");
  };

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="month-picker" className="px-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="month-picker"
            className="w-full justify-between font-normal"
          >
            {getDisplayText()}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <div className="flex flex-col gap-3">
            {/* Year Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handlePreviousYear}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium">{displayYear}</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleNextYear}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Months Grid */}
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((monthName, index) => {
                const isSelected = month === index && year === displayYear;
                const isCurrentMonth =
                  index === currentMonth && displayYear === currentYear;

                return (
                  <Button
                    key={index}
                    variant={isSelected ? "default" : "ghost"}
                    className={cn(
                      "h-10 w-20 text-sm",
                      isSelected && "bg-primary text-primary-foreground",
                      isCurrentMonth &&
                        !isSelected &&
                        "bg-accent text-accent-foreground"
                    )}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {tDate("short_months." + monthName)}
                  </Button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
