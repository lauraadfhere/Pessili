"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Loader } from "@/components/ui/Loader";
import { IconInfo } from "@/components/ui/Icons";
import { DEMO_USERS } from "@/lib/demo-config";

const fieldClass =
  "h-11 w-full border border-rule bg-white px-3 text-[15px] text-text outline-none placeholder:italic placeholder:text-[#9a9a9a] focus:border-brand";

export function LoginForm() {
  const t = useTranslations("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const demoPanelId = useId();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  function homeForRole(role: string) {
    return role === "patient" ? "/patient/dashboard" : "/dashboard";
  }

  useEffect(() => {
    const quick = searchParams.get("quick");
    if (!quick) return;
    void (async () => {
      setPending(true);
      try {
        const response = await fetch("/api/auth/quick", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: quick }),
        });
        const body = (await response.json()) as { error?: string; role?: string };
        if (!response.ok) {
          setError(body.error ?? t("genericError"));
          return;
        }
        router.replace(homeForRole(body.role ?? "patient"));
        router.refresh();
      } finally {
        setPending(false);
      }
    })();
  }, [searchParams, router, t]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string; role?: string };
      if (!response.ok) {
        setError(body.error ?? t("genericError"));
        return;
      }
      router.replace(homeForRole(body.role ?? "patient"));
      router.refresh();
    } catch {
      setError(t("genericError"));
    } finally {
      setPending(false);
    }
  }

  function fillDemo(email: string, password: string) {
    const emailInput = document.getElementById("login-email") as HTMLInputElement | null;
    const passInput = document.getElementById("login-password") as HTMLInputElement | null;
    if (emailInput) emailInput.value = email;
    if (passInput) passInput.value = password;
    setShowDemo(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[14px] font-semibold text-text">{t("formHeading")}</span>
        <div className="relative">
          <button
            type="button"
            className="grid size-8 place-items-center rounded-full border border-rule text-brand hover:bg-panel"
            aria-expanded={showDemo}
            aria-controls={demoPanelId}
            aria-label={t("demoToggle")}
            title={t("demoToggle")}
            onClick={() => setShowDemo((v) => !v)}
          >
            <IconInfo className="size-4" />
          </button>
          {showDemo ? (
            <div
              id={demoPanelId}
              role="region"
              aria-label={t("demoTitle")}
              className="absolute end-0 top-full z-20 mt-2 w-[min(100vw-2rem,320px)] border border-rule bg-white p-3 text-[12px] shadow-lg"
            >
              <p className="font-semibold text-text">{t("demoTitle")}</p>
              <p className="mt-1 text-muted">{t("demoHint")}</p>
              <ul className="mt-3 space-y-2">
                {DEMO_USERS.map((user) => (
                  <li key={user.email} className="rounded border border-rule/80 p-2">
                    <p className="font-medium text-text">{t(`demoRoles.${user.labelKey}`)}</p>
                    <p className="font-mono text-[11px] text-muted">{user.email}</p>
                    <button type="button" className="mt-1 text-brand underline hover:no-underline" onClick={() => fillDemo(user.email, user.password)}>
                      {t("demoUse")}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-[14px] font-semibold">
          {t("email")}
        </label>
        <input id="login-email" name="email" type="email" autoComplete="email" required placeholder={t("emailPlaceholder")} className={fieldClass} />
      </div>
      <div>
        <label htmlFor="login-password" className="mb-1.5 block text-[14px] font-semibold">
          {t("password")}
        </label>
        <input id="login-password" name="password" type="password" autoComplete="current-password" required className={fieldClass} />
      </div>
      {error && (
        <p role="alert" className="border-s-4 border-new bg-white px-3 py-2 text-[14px] text-new">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex h-11 w-full items-center justify-center gap-2 bg-brand text-[15px] font-semibold text-white hover:bg-brand-dark disabled:opacity-80"
      >
        {pending && <Loader size={20} className="text-white" />}
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}