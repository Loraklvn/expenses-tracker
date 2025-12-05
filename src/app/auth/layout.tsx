import { WalletIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { getTranslations } from "next-intl/server";

interface AuthLayoutProps {
  children: React.ReactNode;
}

async function AuthLayout({ children }: AuthLayoutProps) {
  const t = await getTranslations("landing.header");
  const tAuth = await getTranslations("auth");

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-4">
        <div className="max-w-md mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
              <WalletIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-stone-900">
              {t("brand_name")}
            </span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center">
        <p className="text-sm text-stone-500">
          &copy; {new Date().getFullYear()} {t("brand_name")}.{" "}
          {tAuth("all_rights_reserved")}.
        </p>
      </footer>
    </div>
  );
}

export default AuthLayout;
