import { LogoutButton } from "@/components/auth/logout-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getMenuItems } from "@/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "../LanguageSwitcher";
import { ThemeSwitcher } from "../ThemeSwitcher";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const pathname = usePathname();
  const t = useTranslations("side_drawer");

  const menuItems = getMenuItems(t);

  const handleNavigation = () => {
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-72 p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/40">
          <SheetTitle className="sr-only">{t("title")}</SheetTitle>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("preferences")}
            </span>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <div className="h-4 w-px bg-border/60" />
              <LanguageSwitcher />
            </div>
          </div>
        </SheetHeader>

        <SheetDescription className="sr-only">
          {t("preferences_description")}
        </SheetDescription>

        {/* Navigation */}
        <div className="-mt-4 flex flex-col flex-1 overflow-hidden">
          <nav className="flex-1 overflow-y-auto px-3 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    href={item.href}
                    key={item.id}
                    onClick={!item.disabled ? handleNavigation : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      item.disabled &&
                        "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-muted-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0 transition-colors",
                        isActive && "text-primary"
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-border/40 px-3 py-4 space-y-3">
            <LogoutButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
