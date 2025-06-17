import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import Navbar from "@/components/common/Navbar";
import React, { ReactElement } from "react";

const PrivateLayout = ({
  children,
}: {
  children: React.ReactNode;
}): ReactElement => {
  return (
    <div className="max-h-dvh h-full flex-1 flex flex-col overflow-hidden">
      <LanguageSwitcher />
      <main className="flex-1 overflow-y-auto">{children}</main>

      <Navbar />
    </div>
  );
};
export default PrivateLayout;
