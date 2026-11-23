"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Loader } from "@/components/ui/Loader";
import type { PatientProfile } from "@/lib/patient/profile";

type Wilaya = { code: string; name_fr: string; name_ar: string };

type Props = {
  initial: PatientProfile | null;
  wilayas: Wilaya[];
};

export function ProfileForm({ initial, wilayas }: Props) {
  const t = useTranslations("patientProfile");
  const locale = useLocale();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(initial?.avatarUrl ?? "");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const conditionsRaw = String(form.get("conditions") ?? "");
    const conditionsJson = JSON.stringify(
      conditionsRaw
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    );

    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/patient/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          nickname: form.get("nickname"),
          phone: form.get("phone"),
          wilayaCode: form.get("wilayaCode"),
          language: form.get("language"),
          birthYear: Number(form.get("birthYear")) || undefined,
          gender: form.get("gender"),
          medicalHistory: form.get("medicalHistory"),
          conditionsJson,
          avatarUrl: form.get("avatarUrl"),
        }),
      });
      const body = (await res.json()) as { error?: string; quickLoginToken?: string };
      if (!res.ok) {
        setMessage(body.error ?? t("saveError"));
        return;
      }
      setMessage(t("saved"));
      if (body.quickLoginToken) {
        window.dispatchEvent(new CustomEvent("pessili-profile-updated", { detail: { token: body.quickLoginToken } }));
      }
    } catch {
      setMessage(t("saveError"));
    } finally {
      setBusy(false);
    }
  }

  function wilayaLabel(w: Wilaya) {
    return locale === "ar" ? w.name_ar : w.name_fr;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
        <ProfileAvatar avatarPreview={avatarPreview} fallback={initial?.fullName?.[0] ?? "P"} />
        <ProfileField
          id="avatarUrl"
          name="avatarUrl"
          label={t("avatarUrl")}
          defaultValue={initial?.avatarUrl ?? ""}
          placeholder="https://…"
          onUrlChange={setAvatarPreview}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ProfileField id="fullName" name="fullName" label={t("fullName")} defaultValue={initial?.fullName ?? ""} required />
        <ProfileField id="nickname" name="nickname" label={t("nickname")} defaultValue={initial?.nickname ?? ""} />
        <ProfileField id="phone" name="phone" type="tel" label={t("phone")} defaultValue={initial?.phone ?? ""} />
        <ProfileField
          id="birthYear"
          name="birthYear"
          type="number"
          label={t("birthYear")}
          defaultValue={initial?.birthYear ? String(initial.birthYear) : ""}
        />
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[14px] font-semibold">{t("wilaya")}</span>
        <select
          name="wilayaCode"
          defaultValue={initial?.wilayaCode ?? ""}
          className="h-11 w-full border border-rule bg-white px-3 text-[15px] focus:border-brand"
        >
          <option value="">{t("wilayaPlaceholder")}</option>
          {wilayas.map((w) => (
            <option key={w.code} value={w.code}>
              {w.code} — {wilayaLabel(w)}
            </option>
          ))}
        </select>
      </label>

      <ProfileField
        id="conditions"
        name="conditions"
        label={t("conditions")}
        defaultValue={parseConditions(initial?.conditionsJson)}
        hint={t("conditionsHint")}
      />

      <label className="block">
        <span className="mb-1.5 block text-[14px] font-semibold">{t("medicalHistory")}</span>
        <textarea
          name="medicalHistory"
          rows={5}
          defaultValue={initial?.medicalHistory ?? ""}
          className="w-full border border-rule bg-white px-3 py-2 text-[15px] leading-relaxed focus:border-brand"
          placeholder={t("medicalHistoryPlaceholder")}
        />
      </label>

      <ProfileField id="gender" name="gender" label={t("gender")} defaultValue={initial?.gender ?? ""} />

      <input type="hidden" name="language" value={locale} />

      {message ? <p className="text-[14px] text-brand">{message}</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand text-[15px] font-semibold text-white hover:bg-brand-dark disabled:opacity-80 sm:w-auto sm:min-w-[200px]"
      >
        {busy && <Loader size={18} className="text-white" />}
        {busy ? t("saving") : t("save")}
      </button>
    </form>
  );
}

function parseConditions(json?: string) {
  try {
    const arr = JSON.parse(json ?? "[]") as string[];
    return Array.isArray(arr) ? arr.join(", ") : "";
  } catch {
    return "";
  }
}

function ProfileAvatar({ avatarPreview, fallback }: { avatarPreview: string; fallback: string }) {
  return (
    <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-brand/30 bg-brand/5">
      {avatarPreview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarPreview} alt="" className="size-full object-cover" />
      ) : (
        <span className="grid size-full place-items-center text-2xl font-semibold text-brand">{fallback}</span>
      )}
    </div>
  );
}

function ProfileField({
  id,
  name,
  label,
  defaultValue,
  type = "text",
  required,
  placeholder,
  hint,
  onUrlChange,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  onUrlChange?: (v: string) => void;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-[14px] font-semibold">{label}</span>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={onUrlChange ? (e) => onUrlChange(e.target.value) : undefined}
        className="h-11 w-full border border-rule bg-white px-3 text-[15px] focus:border-brand"
      />
      {hint ? <span className="mt-1 block text-[12px] text-muted">{hint}</span> : null}
    </label>
  );
}