"use client";

import { Building2, Laptop, TrendingUp, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function BudgetPreviewCard() {
  const t = useTranslations("landing.budget_preview");

  const incomeData = [
    {
      name: t("main_job"),
      amount: 4500,
      percentage: 82,
      icon: Building2,
      colorClass: "text-emerald-600",
      bgClass: "bg-emerald-600/15",
    },
    {
      name: t("side_projects"),
      amount: 800,
      percentage: 15,
      icon: Laptop,
      colorClass: "text-blue-500",
      bgClass: "bg-blue-500/15",
    },
    {
      name: t("stock_dividends"),
      amount: 200,
      percentage: 4,
      icon: TrendingUp,
      colorClass: "text-purple-500",
      bgClass: "bg-purple-500/15",
    },
  ];

  const total = incomeData.reduce((sum, item) => sum + item.amount, 0);

  // Transform data for PieChart
  const chartData = incomeData.map((item) => ({
    name: item.name,
    value: item.amount,
    percentage: item.percentage,
    icon: item.icon,
    colorClass: item.colorClass,
    bgClass: item.bgClass,
  }));

  const colors = ["#059669", "#3b82f6", "#a855f7"];

  return (
    <div className="w-full max-w-md p-6 shadow-xl border border-stone-200/50 rounded-xl bg-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
          <Wallet className="h-5 w-5 text-emerald-700" />
        </div>
        <h3 className="text-xl font-semibold text-stone-900">{t("title")}</h3>
      </div>

      <div className="flex gap-6 mb-6">
        {/* Donut Chart */}
        <div className="relative flex-shrink-0 w-[120px] h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={58}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-stone-500">{t("total")}</span>
            <span className="text-lg font-bold text-stone-900">
              ${(total / 1000).toFixed(1)}k
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col justify-center gap-4">
          {incomeData.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.bgClass}`}
              >
                <item.icon className={`h-4 w-4 ${item.colorClass}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-stone-900">
                  {item.name}
                </p>
                <p className="text-xs text-stone-500">
                  {item.percentage}
                  {t("of_income")}
                </p>
              </div>
              <span className="text-sm font-semibold text-stone-900">
                ${item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between rounded-lg bg-emerald-600/10 px-4 py-3">
        <span className="text-sm font-medium text-emerald-700">
          {t("total_monthly_income")}
        </span>
        <span className="text-xl font-bold text-emerald-700">
          ${total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
