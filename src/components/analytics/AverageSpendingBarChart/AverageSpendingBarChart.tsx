"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslations } from "next-intl";
import { formatCompactNumber, formatCurrency } from "@/utils/numbers";
import { AverageSpendingChartItem } from "@/utils/dashboard";
import AverageSpendingDetailsModal from "../AverageSpendingDetailsModal";

type AverageSpendingBarChartProps = {
  title: string;
  data: AverageSpendingChartItem[];
  barColor?: string;
  isLoading?: boolean;
};

const MAX_ITEMS = 4;

export default function AverageSpendingBarChart({
  title,
  data,
  barColor = "hsl(var(--chart-2))",
  isLoading = false,
}: AverageSpendingBarChartProps) {
  const t = useTranslations("analytics");
  const [showModal, setShowModal] = useState(false);

  const processedData = useMemo(() => {
    if (data.length === 0) return { chartData: [], hasMore: false };

    const topItems = data.slice(0, MAX_ITEMS);
    const remainingItems = data.slice(MAX_ITEMS);

    if (remainingItems.length === 0) {
      return { chartData: topItems, hasMore: false };
    }

    const othersAvg =
      remainingItems.reduce((sum, item) => sum + item.value, 0) /
      remainingItems.length;
    const othersCount = remainingItems.reduce(
      (sum, item) => sum + item.count,
      0
    );

    const chartData = [
      ...topItems,
      {
        name: t("others"),
        value: othersAvg,
        count: othersCount,
        color: "#9ca3af",
      },
    ];

    return { chartData, hasMore: true };
  }, [data, t]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processedData.chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(value) => formatCompactNumber(value)}
              />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number, _name, props) => {
                  const count = props.payload?.count ?? 0;
                  return [
                    `${formatCurrency(value)} (${t("across_months", { count })})`,
                    t("average_spending_per_month"),
                  ];
                }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="value"
                fill={barColor}
                name={t("average_spending_per_month")}
              />
            </BarChart>
          </ResponsiveContainer>
          {processedData.hasMore && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModal(true)}
              >
                {t("view_more")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <AverageSpendingDetailsModal
        open={showModal}
        onOpenChange={setShowModal}
        title={title}
        data={data}
      />
    </>
  );
}
