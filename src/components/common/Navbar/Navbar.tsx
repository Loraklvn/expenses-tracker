import { HomeIcon, PlusCircleIcon, ReceiptIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ReactElement } from "react";
import SideDrawerWrapper from "../SideDrawerWrapper";

const Navbar = (): ReactElement => {
  const t = useTranslations("common");
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 border-t bg-background flex pt-2 justify-around z-50">
      <Link href="/" className="flex flex-col items-center text-sm">
        <HomeIcon className="w-6 h-6" />
        {t("home")}
      </Link>
      <Link href="/expenses" className="flex flex-col items-center text-sm">
        <ReceiptIcon className="w-6 h-6" />
        {t("expenses")}
      </Link>
      <Link
        href="/select-template"
        className="flex flex-col items-center text-sm"
      >
        <PlusCircleIcon className="w-6 h-6" />
        {t("new")}
      </Link>
      <SideDrawerWrapper />
    </nav>
  );
};
export default Navbar;
