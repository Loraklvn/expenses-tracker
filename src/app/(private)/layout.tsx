import React, { ReactElement } from "react";

const PrivateLayout = ({
  children,
}: {
  children: React.ReactNode;
}): ReactElement => {
  return (
    <div className="max-h-dvh h-full flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto border-2 bg-blue-500">
        {children}
      </main>

      {/* <Navbar /> */}
    </div>
  );
};
export default PrivateLayout;
