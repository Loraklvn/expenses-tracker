import { LogoutButton } from "@/components/auth/logout-button";
import { HomeIcon, PieChartIcon, PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { ReactElement } from "react";

const Navbar = (): ReactElement => {
  return (
    <nav className="h-24 border-t bg-white flex pt-2 justify-around">
      <Link href="/" className="flex flex-col items-center text-sm">
        <HomeIcon className="w-6 h-6" />
        Home
      </Link>
      <button className="flex flex-col items-center text-sm">
        <PieChartIcon className="w-6 h-6" />
        Budgets
      </button>
      <Link href="/new-budget" className="flex flex-col items-center text-sm">
        <PlusCircleIcon className="w-6 h-6" />
        New
      </Link>
      <LogoutButton />
    </nav>
  );
};
export default Navbar;
