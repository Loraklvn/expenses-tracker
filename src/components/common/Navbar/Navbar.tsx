"use client";

import { HomeIcon, PlusCircleIcon, ReceiptIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";
import SideDrawerWrapper from "../SideDrawerWrapper";
import { cn } from "@/lib/utils";

const Navbar = (): ReactElement => {
  const t = useTranslations("common");
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      icon: HomeIcon,
      label: t("home"),
      active: pathname === "/",
    },
    {
      href: "/expenses",
      icon: ReceiptIcon,
      label: t("expenses"),
      active: pathname === "/expenses",
    },
    {
      href: "/select-template",
      icon: PlusCircleIcon,
      label: t("new"),
      active: pathname === "/select-template",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[86px] z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px] py-2 px-3 rounded-xl transition-all duration-200 active:scale-95 relative",
                item.active
                  ? "text-primary bg-blue-50"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/30 active:bg-accent/50"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-6 h-6 transition-all duration-200",
                    item.active
                      ? "text-blue-500 scale-110"
                      : "text-muted-foreground"
                  )}
                  strokeWidth={item.active ? 2.5 : 2}
                />
                {item.active && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full shadow-sm" />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold leading-tight transition-all duration-200",
                  item.active ? "text-blue-500" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        <SideDrawerWrapper />
      </div>
    </nav>
  );
};
export default Navbar;
