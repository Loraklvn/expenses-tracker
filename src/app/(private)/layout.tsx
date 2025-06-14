import { HomeIcon, PieChartIcon, PlusCircleIcon } from "lucide-react";
import React, { ReactElement } from "react";

const PrivateLayout = ({
  children,
}: {
  children: React.ReactNode;
}): ReactElement => {
  return (
    <div className="max-h-dvh h-full flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto">{children}</main>

      <nav className="h-16 border-t bg-white flex items-center justify-around">
        <button className="flex flex-col items-center text-sm">
          <HomeIcon className="w-6 h-6" />
          Home
        </button>
        <button className="flex flex-col items-center text-sm">
          <PieChartIcon className="w-6 h-6" />
          Budgets
        </button>
        <button className="flex flex-col items-center text-sm">
          <PlusCircleIcon className="w-6 h-6" />
          New
        </button>
        {/* <LogoutButton /> */}
      </nav>
    </div>
  );
};
export default PrivateLayout;
