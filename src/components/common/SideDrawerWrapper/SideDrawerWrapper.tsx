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
        className="flex flex-col items-center text-sm"
        onClick={() => setIsDrawerOpen(true)}
      >
        <MenuIcon className="w-6 h-6" />
        {t("menu")}
      </button>
    </>
  );
};
export default SideDrawerWrapper;
