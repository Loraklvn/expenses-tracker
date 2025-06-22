import Navbar from "@/components/common/Navbar";
import SideDrawerWrapper from "@/components/common/SideDrawerWrapper";
import React, { ReactElement } from "react";

const PrivateLayout = ({
  children,
}: {
  children: React.ReactNode;
}): ReactElement => {
  return (
    <div className="max-h-dvh h-full flex-1 flex flex-col overflow-hidden">
      <SideDrawerWrapper />
      <main className="flex-1 overflow-y-auto">{children}</main>

      <Navbar />
    </div>
  );
};
export default PrivateLayout;
