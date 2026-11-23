"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";

type Profile = {
  displayName: string;
  type: string;
  bioAr: string;
  bioFr: string;
  languages: string[];
  formats: Array<"video" | "audio" | "chat">;
  specialties: string[];
  avatarDataUrl?: string;
  licenceExpiry: string;
};

export function ProfileEditor() {
  const t = useTranslations("clinicianProfile");
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [bioAr, setBioAr] = useState("");
  const [bioFr, setBioFr] = useState("");
  const [langs, setLangs] = useState({ ar: true, fr: true, darija: true, en: false });
  const [formats, setFormats] = useState({ video: true, audio: true, chat: true });
  const [type, setType] = useState("psychologist");
  const [licenceExpiry, setLicenceExpiry] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/clinician/profile");
        if (!res.ok) throw new Error("Failed to load profile");
        const json = (await res.json()) as { profile: Profile };
        if (cancelled) return;
        const p = json.profile;
        setDisplayName(p.displayName);
        setBioAr(p.bioAr);
        setBioFr(p.bioFr);
        setType(p.type);
        setLicenceExpiry(p.licenceExpiry);
        setPreview(p.avatarDataUrl ?? null);
        setLangs({
          ar: p.languages.includes("ar"),
          fr: p.languages.includes("fr"),
          darija: p.languages.includes("darija"),
          en: p.languages.includes("en"),
        });
        setFormats({
          video: p.formats.includes("video"),
          audio: p.formats.includes("audio"),
          chat: p.formats.includes("chat"),
        });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function onPickFile(file: File | null) {
    if (!file) return;
    setPendingFile(file);
    setRemoveAvatar(false);
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const form = new FormData();
      form.set("displayName", displayName);
      form.set("bioAr", bioAr);
      form.set("bioFr", bioFr);
      if (removeAvatar) form.set("removeAvatar", "1");
      if (pendingFile) form.set("avatar", pendingFile);

      const res = await fetch("/api/clinician/profile", { method: "PATCH", body: form });
      const json = (await res.json().catch(() => null)) as { profile?: Profile; error?: string } | null;
      if (!res.ok) throw new Error(json?.error || "Save failed");

      const languages = (Object.keys(langs) as Array<keyof typeof langs>).filter((k) => langs[k]);
      const formatList = (Object.keys(formats) as Array<keyof typeof formats>).filter((k) => formats[k]);
      const res2 = await fetch("/api/clinician/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ languages, formats: formatList }),
      });
      const json2 = (await res2.json().catch(() => null)) as { profile?: Profile; error?: string } | null;
      if (!res2.ok) throw new Error(json2?.error || "Save failed");

      const profile = json2?.profile ?? json?.profile;
      if (profile) {
        setPreview(profile.avatarDataUrl ?? null);
        setPendingFile(null);
        setRemoveAvatar(false);
      }
      setSaved(true);
      window.dispatchEvent(new Event("pessili:clinician-profile"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-[14px] text-muted">{t("loading")}</p>;
  }

  return (
    <form className="space-y-6" onSubmit={(e) => void onSubmit(e)}>
      <div className="flex flex-wrap items-start gap-5 border border-rule bg-white p-4">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-rule bg-panel">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[22px] font-semibold text-brand">
                {displayName
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            )}
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[13px] font-semibold text-text">{t("avatar")}</p>
          <p className="text-[12px] text-muted">{t("avatarHint")}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md bg-brand px-3 py-2 text-[13px] font-semibold text-white hover:bg-brand-dark"
              onClick={() => fileRef.current?.click()}
            >
              {t("uploadAvatar")}
            </button>
            {preview ? (
              <button
                type="button"
                className="rounded-md border border-rule px-3 py-2 text-[13px] font-semibold hover:bg-panel"
                onClick={() => {
                  setPendingFile(null);
                  setRemoveAvatar(true);
                  setPreview(null);
                }}
              >
                {t("removeAvatar")}
              </button>
            ) : null}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      <label className="block text-[13px]">
        {t("displayName")}
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mt-1 w-full border border-rule px-3 py-2 text-[14px]"
          required
        />
      </label>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block text-[13px]">
          {t("bioAr")}
          <textarea value={bioAr} onChange={(e) => setBioAr(e.target.value)} rows={4} dir="rtl" className="mt-1 w-full border border-rule px-3 py-2 text-[14px]" />
        </label>
        <label className="block text-[13px]">
          {t("bioFr")}
          <textarea value={bioFr} onChange={(e) => setBioFr(e.target.value)} rows={4} className="mt-1 w-full border border-rule px-3 py-2 text-[14px]" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-rule bg-white p-4">
          <p className="text-[12px] font-semibold uppercase text-muted">{t("credentials")}</p>
          <div className="mt-2">
            <StatusPill label={t("verified")} tone="ok" />
          </div>
          <p className="mt-3 text-[12px] uppercase text-muted">{t("licence")}</p>
          <p className="text-[14px] font-semibold">{licenceExpiry || t("licenceDate")}</p>
          <p className="mt-1 text-[12px] text-muted">{t("licenceReminder")}</p>
        </div>
        <div className="border border-rule bg-white p-4">
          <p className="text-[12px] font-semibold uppercase text-muted">{t("training")}</p>
          <div className="mt-2">
            <StatusPill label={t("trainingDone")} tone="ok" />
          </div>
          <p className="mt-3 text-[12px] uppercase text-muted">{t("agreements")}</p>
          <p className="text-[14px] text-text">✓ Terms · Confidentiality · Crisis protocol</p>
          <p className="mt-2 text-[13px] text-muted">
            {displayName} · {type}
          </p>
        </div>
      </div>

      <fieldset>
        <legend className="text-[12px] font-semibold uppercase text-muted">{t("languages")}</legend>
        <div className="mt-2 flex flex-wrap gap-3 text-[14px]">
          {(
            [
              ["ar", "Arabic"],
              ["fr", "French"],
              ["darija", "Darija"],
              ["en", "English"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={langs[key]}
                onChange={(e) => setLangs((s) => ({ ...s, [key]: e.target.checked }))}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[12px] font-semibold uppercase text-muted">{t("formats")}</legend>
        <div className="mt-2 flex flex-wrap gap-3 text-[14px]">
          {(
            [
              ["video", "Video"],
              ["audio", "Audio"],
              ["chat", "Chat"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formats[key]}
                onChange={(e) => setFormats((s) => ({ ...s, [key]: e.target.checked }))}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <p className="text-[12px] font-semibold uppercase text-muted">{t("specialties")}</p>
        <p className="mt-2 text-[14px] text-text">CBT · Trauma · Anxiety · Young adults</p>
      </div>

      {error ? <p className="text-[13px] text-new">{error}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="bg-brand px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {saving ? t("saving") : t("save")}
      </button>
      {saved ? <p className="text-[13px] text-brand">{t("saved")}</p> : null}
    </form>
  );
}
