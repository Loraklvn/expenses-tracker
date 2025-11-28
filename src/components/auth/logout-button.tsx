"use client";

import { getSupabaseClient } from "@/src/lib/supabase/client";
import { LogOutIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function LogoutButton() {
  const router = useRouter();
  const t = useTranslations("common");

  const logout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button
      variant="ghost"
      onClick={logout}
      className="w-full flex items-center gap-3 px-3 py-2.5 h-auto text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors rounded-md"
    >
      <LogOutIcon className="h-4 w-4 flex-shrink-0" />
      <span>{t("logout")}</span>
    </Button>
  );
}
