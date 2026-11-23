"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export function SignOutButton({ className = "" }: { className?: string }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    await fetch("/api/auth/demo", { method: "DELETE" });
    router.replace("/login");
    router.refresh();
    setBusy(false);
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={signOut}
      className={`bg-chrome px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#222] disabled:opacity-70 ${className}`}
    >
      {t("signOut")}
    </button>
  );
}