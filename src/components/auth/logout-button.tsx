"use client";

import { createClient } from "@/src/lib/supabase/client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <button className="flex flex-col items-center text-sm" onClick={logout}>
      <LogOutIcon className="w-6 h-6" />
      Logout
    </button>
  );
}
