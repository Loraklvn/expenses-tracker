import {
  ArrowRightLeftIcon,
  BarChart3Icon,
  CalendarIcon,
  DollarSignIcon,
  FileTextIcon,
  ListIcon,
  SettingsIcon,
  TagIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

export function genId() {
  return typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const getMenuItems = (t: ReturnType<typeof useTranslations>) => {
  return [
    {
      id: "budgets",
      label: t("my_budgets"),
      icon: DollarSignIcon,
      description: t("my_budgets_description"),
      href: "/",
    },
    {
      id: "create-budget",
      label: t("create_budget"),
      icon: CalendarIcon,
      description: t("create_budget_description"),
      href: "/select-template",
    },
    {
      id: "budget-templates",
      label: t("budget_templates"),
      icon: FileTextIcon,
      description: t("budget_templates_description"),
      href: "/budget_templates",
    },
    {
      id: "manage-expenses",
      label: t("manage_expenses"),
      icon: ListIcon,
      description: t("manage_expenses_description"),
      href: "/expenses",
    },
    {
      id: "categories",
      label: t("categories"),
      icon: TagIcon,
      description: t("categories_description"),
      href: "/categories",
    },
    {
      id: "income-sources",
      label: t("income_sources"),
      icon: TrendingUpIcon,
      description: t("income_sources_description"),
      href: "/income-sources",
    },
    {
      id: "transactions",
      label: t("transactions"),
      icon: ArrowRightLeftIcon,
      description: t("transactions_description"),
      href: "/transactions",
    },
    {
      id: "analytics",
      label: t("analytics"),
      icon: BarChart3Icon,
      description: t("analytics_description"),
      href: "#",
      disabled: true,
    },
    {
      id: "settings",
      label: t("settings"),
      icon: SettingsIcon,
      description: t("settings_description"),
      href: "#",
      disabled: true,
    },
  ];
};
