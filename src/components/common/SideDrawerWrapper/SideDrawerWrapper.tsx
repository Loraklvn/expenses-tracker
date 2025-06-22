"use client";

import React, { ReactElement } from "react";
import SideDrawer from "../SideDrawer";
import LanguageSwitcher from "../LanguageSwitcher";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";

const SideDrawerWrapper = (): ReactElement => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <>
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <div className="flex justify-between items-center p-3 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDrawerOpen(true)}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </div>
    </>
  );
};
export default SideDrawerWrapper;
