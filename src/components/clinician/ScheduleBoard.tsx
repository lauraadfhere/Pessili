"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { StatusPill } from "@/components/workspace/StatusPill";

const SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "18:00", "19:00"];
const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

const BOOKED: Record<string, string[]> = {
  mon: ["10:00", "14:00"],
  tue: ["11:00", "18:00"],
  wed: ["09:00", "15:00", "19:00"],
  thu: ["10:00"],
  fri: ["14:00", "16:00"],
  sat: ["10:00"],
  sun: [],
};

const ON_DEMAND: Record<string, string[]> = {
  mon: ["18:00", "19:00"],
  tue: ["18:00", "19:00"],
  wed: ["18:00", "19:00"],
  thu: ["18:00", "19:00"],
  fri: ["18:00", "19:00"],
  sat: ["10:00", "11:00"],
  sun: [],
};

export function ScheduleBoard() {
  const t = useTranslations("clinicianSchedule");
  const [blocked, setBlocked] = useState<{ day: string; slot: string }[]>([]);
  const [formats, setFormats] = useState({ video: true, audio: true, chat: true });

  function toggleBlock(day: string, slot: string) {
    setBlocked((prev) => {
      const exists = prev.some((b) => b.day === day && b.slot === slot);
      if (exists) return prev.filter((b) => !(b.day === day && b.slot === slot));
      return [...prev, { day, slot }];
    });
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto border border-rule bg-white">
        <table className="min-w-[720px] w-full border-collapse text-[12px]">
          <thead>
            <tr className="bg-panel-head">
              <th className="border-b border-rule px-2 py-2 text-start font-semibold">{t("weekly")}</th>
              {DAY_KEYS.map((d) => (
                <th key={d} className="border-b border-rule px-2 py-2 font-semibold">
                  {t(`days.${d}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot) => (
              <tr key={slot}>
                <td className="border-b border-rule px-2 py-1.5 font-medium text-muted">{slot}</td>
                {DAY_KEYS.map((day) => {
                  const booked = BOOKED[day]?.includes(slot);
                  const onDemand = ON_DEMAND[day]?.includes(slot);
                  const isBlocked = blocked.some((b) => b.day === day && b.slot === slot);
                  return (
                    <td key={day} className="border-b border-rule px-1 py-1 text-center">
                      <button
                        type="button"
                        onClick={() => toggleBlock(day, slot)}
                        className={`min-h-8 w-full px-1 py-1 ${
                          isBlocked
                            ? "bg-new/15 text-new"
                            : booked
                              ? "bg-brand/15 text-brand"
                              : onDemand
                                ? "bg-promo-accent/15 text-promo-accent"
                                : "hover:bg-panel-head"
                        }`}
                        title={t("blockTime")}
                      >
                        {isBlocked ? "✕" : booked ? "●" : onDemand ? "◆" : "·"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12px] text-muted">{t("blockHint")}</p>
      {blocked.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {blocked.map((b) => (
            <StatusPill key={`${b.day}-${b.slot}`} label={t("blocked", { label: `${b.day} ${b.slot}` })} tone="danger" />
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-rule bg-white p-4">
          <h3 className="text-[14px] font-semibold">{t("onDemand")}</h3>
          <p className="mt-2 text-[13px] text-muted">{t("onDemandDetail")}</p>
        </div>
        <div className="border border-rule bg-white p-4">
          <h3 className="text-[14px] font-semibold">{t("buffers")}</h3>
          <p className="mt-2 text-[13px] text-muted">{t("bufferNote")}</p>
          <p className="mt-2 text-[13px] text-muted">{t("priceNote")}</p>
        </div>
      </div>

      <div className="border border-rule bg-white p-4">
        <h3 className="text-[14px] font-semibold">{t("formats")}</h3>
        <div className="mt-3 flex flex-wrap gap-3 text-[14px]">
          {(
            [
              ["video", t("video")],
              ["audio", t("audio")],
              ["chat", t("chat")],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formats[key]}
                onChange={(e) => setFormats((f) => ({ ...f, [key]: e.target.checked }))}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="border border-rule bg-white p-4">
        <h3 className="text-[14px] font-semibold">{t("exceptions")}</h3>
        <p className="mt-2 text-[13px] text-muted">{t("exceptionsNote")}</p>
      </div>
    </div>
  );
}
