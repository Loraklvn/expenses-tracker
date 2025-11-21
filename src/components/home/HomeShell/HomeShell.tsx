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
    <div className="min-h-dvh bg-background">
      <div className="max-w-md mx-auto">
        {/* Sticky Tabs Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="flex relative">
            <Link
              href="/?tab=budgets"
              className={`flex-1 relative flex items-center justify-center min-h-[56px] px-4 text-base font-semibold transition-all duration-200 ${
                homeTab === "budgets"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground active:bg-accent/50"
              }`}
            >
              <span className="relative z-10">{t("my_budgets")}</span>
              {homeTab === "budgets" && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full transition-all duration-300 shadow-sm" />
              )}
            </Link>
            <Link
              href="/?tab=income"
              className={`flex-1 relative flex items-center justify-center min-h-[56px] px-4 text-base font-semibold transition-all duration-200 ${
                homeTab === "income"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground active:bg-accent/50"
              }`}
            >
              <span className="relative z-10">{t("income")}</span>
              {homeTab === "income" && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full transition-all duration-300 shadow-sm" />
              )}
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {homeTab === "income" ? (
            <IncomesSection />
          ) : (
            <BudgetsList budgets={budgets} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeShell;
