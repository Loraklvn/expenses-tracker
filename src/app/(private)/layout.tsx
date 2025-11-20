import Navbar from "@/components/common/Navbar";
import SideDrawerWrapper from "@/components/common/SideDrawerWrapper";
import React, { ReactElement } from "react";

const PrivateLayout = ({
  children,
}: {
  children: React.ReactNode;
}): ReactElement => {
  return (
    <div className="max-h-lvh h-full flex-1 flex flex-col overflow-hidden">
      <SideDrawerWrapper />
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>

      <Navbar />
    </div>
  );
};
export default PrivateLayout;
