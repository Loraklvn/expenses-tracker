import { LogoutButton } from "@/components/logout-button";
import { HomeIcon, PieChartIcon, PlusCircleIcon } from "lucide-react";
import { ReactElement } from "react";

const Navbar = (): ReactElement => {
  return (
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
      <LogoutButton />
    </nav>
  );
};
export default Navbar;
