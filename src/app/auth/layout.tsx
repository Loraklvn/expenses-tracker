import LanguageSwitcher from "@/components/common/LanguageSwitcher/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="flex justify-between p-3 border-b border-border">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <div className="flex   w-full items-center justify-center p-6  pt-[100px]">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
