import { LogoutButton } from "@/components/auth/logout-button";
import { HomeIcon, PlusCircleIcon, ReceiptIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ReactElement } from "react";

const Navbar = (): ReactElement => {
  const t = useTranslations("common");
  return (
    <nav className="h-24 border-t bg-white flex pt-2 justify-around">
      <Link href="/" className="flex flex-col items-center text-sm">
        <HomeIcon className="w-6 h-6" />
        {t("home")}
      </Link>
      <Link href="/expenses" className="flex flex-col items-center text-sm">
        <ReceiptIcon className="w-6 h-6" />
        {t("expenses")}
      </Link>
      <Link href="/new-budget" className="flex flex-col items-center text-sm">
        <PlusCircleIcon className="w-6 h-6" />
        {t("new")}
      </Link>
      <LogoutButton />
    </nav>
  );
};
export default Navbar;
