import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ReactElement } from "react";
import LanguageSwitcher from "../LanguageSwitcher";

const Navbar = (): ReactElement => {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 px-2">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex items-center">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
        <AuthButton />
      </div>
    </nav>
  );
};
export default Navbar;
