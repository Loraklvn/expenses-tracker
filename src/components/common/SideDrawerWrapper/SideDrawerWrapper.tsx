"use client";

import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { ReactElement } from "react";
import SideDrawer from "../SideDrawer";

const SideDrawerWrapper = (): ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const t = useTranslations("common");

  return (
    <>
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <button
        className="flex flex-col items-center justify-center gap-1 min-w-[64px] py-2 px-3 rounded-xl transition-all duration-200 active:scale-95 text-muted-foreground hover:text-foreground hover:bg-accent/30 active:bg-accent/50"
        onClick={() => setIsDrawerOpen(true)}
      >
        <MenuIcon
          className="w-6 h-6 transition-all duration-200"
          strokeWidth={2}
        />
        <span className="text-[10px] font-semibold leading-tight">
          {t("menu")}
        </span>
      </button>
    </>
  );
};
export default SideDrawerWrapper;
