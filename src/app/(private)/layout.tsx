import Navbar from "@/components/common/Navbar";
import React, { ReactElement } from "react";

const PrivateLayout = ({
  children,
}: {
  children: React.ReactNode;
}): ReactElement => {
  return (
    <div className="max-h-lvh h-full flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {children}
      </main>

      <Navbar />
    </div>
  );
};
export default PrivateLayout;
