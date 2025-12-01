"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MonthlyFlowData } from "@/lib/supabase/request/client";
import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactNumber } from "@/utils/numbers";
import { getLastDayOfMonthDate } from "@/utils/date";

type MonthlyFlowChartProps = {
  data: MonthlyFlowData[];
  isLoading?: boolean;
};

export default function MonthlyFlowChart({
  data,
  isLoading = false,
}: MonthlyFlowChartProps) {
  const t = useTranslations("analytics");
  const tDate = useTranslations("date");

  // Format data for chart - show last 6 months
  const chartData = [...data].slice(data.length - 6).map((item) => {
    const [year, month] = item.month_start.split("-").map(Number);
    const lastDay = getLastDayOfMonthDate(year, month - 1);
    return {
      month: lastDay
        .toLocaleDateString("en-US", {
          month: "short",
        })
        .toLowerCase() as string,
      income: item.total_income,
      spending: item.total_spending,
    };
  });

  // Calculate net savings for the latest month
  const latestMonth = chartData[chartData.length - 1];
  const netSavings = latestMonth
    ? latestMonth.income - latestMonth.spending
    : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("income_vs_spending_history")}</CardTitle>
          <CardDescription>{t("last_6_months_comparison")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("income_vs_spending_history")}</CardTitle>
          <CardDescription>{t("last_6_months_comparison")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            {t("no_data")}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          {t("income_vs_spending_history")}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {t("last_6_months_comparison")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={2}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => tDate("short_months." + value)}
                tick={{ fontSize: 11, fill: "#71717a" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#71717a" }}
                tickFormatter={(value) => formatCompactNumber(value)}
                width={60}
                domain={[0, "dataMax"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => [
                  `$${value.toLocaleString()}`,
                  name === "income" ? "Income" : "Spent",
                ]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                formatter={(value) =>
                  value === "income" ? t("income") : t("spending")
                }
              />
              <Bar
                dataKey="income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
              <Bar
                dataKey="spending"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Net savings summary */}
        <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
          <span className="text-sm text-muted-foreground">
            {t("net_flow")} - {tDate("long_months." + latestMonth.month)}
          </span>
          <span
            className={`text-sm font-semibold ${
              netSavings >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {netSavings >= 0 ? "+" : ""}${netSavings.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
