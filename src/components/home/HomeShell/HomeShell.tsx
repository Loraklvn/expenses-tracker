"use client";

import Link from "next/link";
import React from "react";
import { useSearchParams } from "next/navigation";
import BudgetsList from "@/components/home/BudgetsList";
import IncomesSection from "@/components/income/IncomesSection";
import { BudgetWithCurrent } from "@/types";
import { useTranslations } from "next-intl";

interface HomeShellProps {
  budgets: BudgetWithCurrent[];
}

const HomeShell = ({ budgets }: HomeShellProps) => {
  const t = useTranslations("Home");
  const searchParams = useSearchParams();
  const homeTab = searchParams.get("tab") || "budgets";

  return (
    <div className="min-h-dvh bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex bg-muted rounded-lg p-1 mb-6">
          <Link
            href="/?tab=budgets"
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              homeTab === "budgets"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("my_budgets")}
          </Link>
          <Link
            href="/?tab=income"
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              homeTab === "income"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("income")}
          </Link>
        </div>

        {homeTab === "income" ? (
          <IncomesSection />
        ) : (
          <BudgetsList budgets={budgets} />
        )}
      </div>
    </div>
  );
};

export default HomeShell;
