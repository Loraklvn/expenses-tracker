import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
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
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const pathname = usePathname();
  const t = useTranslations("side_drawer");

  console.log({ pathname });
  const menuItems = [
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

  const handleNavigation = () => {
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" showCloseButton={false} className="w-80 p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">{t("title")}</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    href={item.href}
                    key={item.id}
                    onClick={!item.disabled ? handleNavigation : undefined}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground",
                      item.disabled &&
                        "cursor-not-allowed opacity-60 hover:bg-transparent"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium ${
                          isActive
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {item.label}
                      </p>
                      <p
                        className={`text-sm ${
                          isActive
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="p-4 border-t">
            <div className="text-center text-sm text-muted-foreground">
              <p>{t("footer")}</p>
              <p className="mt-1">{t("footer_description")}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
