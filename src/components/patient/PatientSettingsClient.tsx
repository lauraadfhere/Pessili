"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Panel } from "@/components/ui/SectionTitle";
import { StatusPill } from "@/components/workspace/StatusPill";
import { DEMO_CONSENT_HISTORY, DEMO_DEVICES } from "@/lib/patient/demo-care";

export function PatientSettingsClient() {
  const t = useTranslations("patientSettings");
  const [discreet, setDiscreet] = useState(false);
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [devices, setDevices] = useState(DEMO_DEVICES);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  function logoutDevice(id: string) {
    setDevices((list) => list.filter((d) => d.id !== id || d.current));
    setSavedNote(t("devices.loggedOut"));
  }

  function confirmExport() {
    if (window.confirm(t("data.exportConfirm"))) {
      setSavedNote(t("data.exportDone"));
    }
  }

  function confirmDelete() {
    if (window.confirm(t("data.deleteConfirm"))) {
      setSavedNote(t("data.deleteDone"));
    }
  }

  return (
    <div className="space-y-6">
      {savedNote ? (
        <p className="border-s-4 border-brand bg-panel px-3 py-2 text-[13px] text-text">{savedNote}</p>
      ) : null}

      <Panel title={t("language.title")}>
        <p className="text-[14px] leading-relaxed text-muted">{t("language.body")}</p>
      </Panel>

      <Panel title={t("discreet.title")}>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={discreet}
            onChange={(e) => setDiscreet(e.target.checked)}
            className="mt-1"
          />
          <span>
            <span className="block text-[14px] font-semibold text-text">{t("discreet.toggle")}</span>
            <span className="mt-1 block text-[13px] text-muted">{t("discreet.hint")}</span>
          </span>
        </label>
        {discreet ? <p className="mt-3 text-[13px] text-brand">{t("discreet.on")}</p> : null}
      </Panel>

      <Panel title={t("emergency.title")}>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block text-[14px]">
            <span className="mb-1 block font-semibold">{t("emergency.name")}</span>
            <input
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
              className="min-h-11 w-full border border-rule bg-white px-3 text-[14px] focus:border-brand"
            />
          </label>
          <label className="block text-[14px]">
            <span className="mb-1 block font-semibold">{t("emergency.relation")}</span>
            <input
              value={emergencyRelation}
              onChange={(e) => setEmergencyRelation(e.target.value)}
              className="min-h-11 w-full border border-rule bg-white px-3 text-[14px] focus:border-brand"
            />
          </label>
          <label className="block text-[14px]">
            <span className="mb-1 block font-semibold">{t("emergency.phone")}</span>
            <input
              type="tel"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              className="min-h-11 w-full border border-rule bg-white px-3 text-[14px] focus:border-brand"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={() => setSavedNote(t("emergency.saved"))}
          className="mt-4 min-h-11 bg-brand px-5 text-[14px] font-semibold text-white hover:bg-brand-dark"
        >
          {t("emergency.save")}
        </button>
      </Panel>

      <Panel title={t("appLock.title")}>
        <p className="text-[14px] leading-relaxed text-muted">{t("appLock.body")}</p>
      </Panel>

      <Panel title={t("consent.title")}>
        <ul className="space-y-2">
          {DEMO_CONSENT_HISTORY.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 border border-rule bg-white px-3 py-2 text-[14px]">
              <span className="text-text">{t(`consent.items.${row.labelKey}`)}</span>
              <span className="text-[12px] text-muted">{row.when}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title={t("devices.title")}>
        <ul className="space-y-2">
          {devices.map((device) => (
            <li
              key={device.id}
              className="flex flex-wrap items-center justify-between gap-3 border border-rule bg-white px-3 py-3"
            >
              <div>
                <p className="text-[14px] font-medium text-text">{device.name}</p>
                <p className="text-[12px] text-muted">{t("devices.lastActive", { when: device.lastActive })}</p>
              </div>
              <div className="flex items-center gap-2">
                {device.current ? <StatusPill label={t("devices.current")} tone="brand" /> : null}
                {!device.current ? (
                  <button
                    type="button"
                    onClick={() => logoutDevice(device.id)}
                    className="min-h-9 border border-rule px-3 text-[13px] font-medium text-text hover:border-brand"
                  >
                    {t("devices.logout")}
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title={t("data.title")}>
        <p className="text-[14px] text-muted">{t("data.body")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={confirmExport}
            className="min-h-11 bg-brand px-4 text-[14px] font-semibold text-white hover:bg-brand-dark"
          >
            {t("data.export")}
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="min-h-11 border border-new px-4 text-[14px] font-semibold text-new hover:bg-new/5"
          >
            {t("data.delete")}
          </button>
        </div>
      </Panel>

      <p className="text-[14px] text-muted">
        {t("profileLink.prefix")}{" "}
        <Link href="/patient/profile" className="font-semibold text-link underline hover:text-link-hover">
          {t("profileLink.cta")}
        </Link>
      </p>
    </div>
  );
}
