import Navbar from "@/components/common/Navbar";
import React, { ReactElement } from "react";

const PrivateLayout = ({
  children,
}: {
  children: React.ReactNode;
}): ReactElement => {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
};
export default PrivateLayout;
