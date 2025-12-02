"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber, formatCurrency } from "@/utils/numbers";
import { Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

type IncomeBySourceChartProps = {
  data: Array<{ name: string; value: number }>;
  isLoading?: boolean;
};

// USE BETTER COLORS FOR THE CHART
const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f97316", "#ec4899"];

export default function IncomeBySourceChart({
  data: sources,
}: IncomeBySourceChartProps) {
  const t = useTranslations("analytics");
  const totalIncome = useMemo(
    () => sources.reduce((acc, source) => acc + source.value, 0),
    [sources]
  );

  if (!sources || sources.length === 0 || totalIncome <= 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            {t("income_sources")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t("no_income_sources_available")}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate percentages and prepare chart data with null safety
  const chartData = sources.map((source, index) => ({
    name: source.name,
    value: source.value,
    percent: Math.round((source.value / totalIncome) * 100),
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          {t("income_sources")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Mini Donut Chart */}
          <div className="relative h-40 w-40 shrink-0 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={78}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-muted-foreground">
                {t("total")}
              </span>
              <span className="text-xs font-bold">
                ${formatCompactNumber(totalIncome)}
              </span>
            </div>
          </div>

          {/* Income Sources List */}
          <div className="flex-1 space-y-2">
            {chartData.map((source) => {
              const IconComponent = Wallet;
              return (
                <div key={source.name} className="flex items-center gap-2">
                  {/* Color indicator and icon */}
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${source.color}20` }}
                  >
                    <IconComponent
                      className="h-4 w-4"
                      style={{ color: source.color }}
                    />
                  </div>

                  {/* Name and percentage */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {source.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {source.percent}% {t("of_total_income")}
                    </p>
                  </div>

                  {/* Amount - with null safety */}
                  <span className="shrink-0 text-sm font-semibold tabular-nums">
                    ${(source.value ?? 0).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
          <span className="text-sm font-medium text-emerald-800">
            {t("total_income")}
          </span>
          <span className="text-lg font-bold text-emerald-600">
            {formatCurrency(totalIncome, { minimumFractionDigits: 0 })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
