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
import SpendingDetailsModal from "../SpendingDetailsModal";

type SpendingByCategoryChartProps = {
  data: Array<{ name: string; value: number; color?: string }>;
  isLoading?: boolean;
};

const MAX_ITEMS = 4;

export default function SpendingByCategoryChart({
  data,
  isLoading = false,
}: SpendingByCategoryChartProps) {
  const t = useTranslations("analytics");
  const [showModal, setShowModal] = useState(false);

  // Process data: show top items + "Others"
  const processedData = useMemo(() => {
    if (data.length === 0) return { chartData: [], hasMore: false };

    const topItems = data.slice(0, MAX_ITEMS);
    const remainingItems = data.slice(MAX_ITEMS);

    if (remainingItems.length === 0) {
      return { chartData: topItems, hasMore: false };
    }

    // Calculate "Others" total
    const othersTotal = remainingItems.reduce(
      (sum, item) => sum + item.value,
      0
    );

    const chartData = [
      ...topItems,
      {
        name: t("others") || "Others",
        value: othersTotal,
        color: "#9ca3af", // gray color for "Others"
      },
    ];

    return { chartData, hasMore: true, remainingItems };
  }, [data, t]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("spending_by_category")}</CardTitle>
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
          <CardTitle>{t("spending_by_category")}</CardTitle>
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
          <CardTitle>{t("spending_by_category")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processedData.chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={(value) => formatCompactNumber(value)}
              />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="value"
                fill="hsl(0, 84%, 60%)"
                name={t("spending")}
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
                {t("view_more") || "View More"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <SpendingDetailsModal
        open={showModal}
        onOpenChange={setShowModal}
        title={t("spending_by_category")}
        data={data}
      />
    </>
  );
}
