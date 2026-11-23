"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Loader } from "@/components/ui/Loader";
import { Panel } from "@/components/ui/SectionTitle";

type MessageRow = {
  $id?: string;
  doctorName: string;
  body: string;
  fromRole: "doctor" | "patient";
  read: boolean;
  createdAt: string;
};

const POLL_MS = 5000;

export function MessagesCenter() {
  const t = useTranslations("patientMessages");
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async (markRead = false) => {
    const res = await fetch(`/api/patient/messages${markRead ? "?markRead=1" : ""}`);
    const data = (await res.json()) as { messages?: MessageRow[] };
    if (res.ok && data.messages) setMessages(data.messages);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(true);
    const id = window.setInterval(() => void load(false), POLL_MS);
    return () => window.clearInterval(id);
  }, [load]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/patient/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: draft }),
      });
      if (res.ok) {
        setDraft("");
        await load(false);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <Panel title={t("inboxTitle")}>
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader size={36} label={t("loading")} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border-s-4 border-new bg-panel px-3 py-3 text-[13px] text-text">
            <p className="font-semibold">{t("crisisBanner.title")}</p>
            <p className="mt-1 text-muted">{t("crisisBanner.body")}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Link href="/crisis" className="font-semibold text-link underline hover:text-link-hover">
                {t("crisisBanner.crisis")}
              </Link>
              <Link href="/patient/talk-now" className="font-semibold text-link underline hover:text-link-hover">
                {t("crisisBanner.talkNow")}
              </Link>
            </div>
          </div>
          <p className="border-s-4 border-brand bg-panel px-3 py-2 text-[13px] text-muted">{t("inboxHint")}</p>
          <ul className="max-h-[min(55vh,480px)] space-y-3 overflow-y-auto border border-rule bg-white p-3">
            {messages.length === 0 ? (
              <li className="text-[14px] text-muted">{t("empty")}</li>
            ) : (
              messages.map((m) => (
                <li
                  key={m.$id ?? m.createdAt}
                  className={`rounded-sm border px-3 py-3 text-[14px] ${
                    m.fromRole === "doctor" ? "border-brand/30 bg-[#f0f9fb]" : "border-rule bg-panel"
                  } ${!m.read && m.fromRole === "doctor" ? "ring-1 ring-brand/40" : ""}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-[12px] font-semibold text-text">
                      {m.fromRole === "doctor" ? m.doctorName : t("you")}
                    </span>
                    <time className="text-[11px] text-muted">{formatWhen(m.createdAt)}</time>
                  </div>
                  <p className="mt-1.5 leading-relaxed text-text">{m.body}</p>
                </li>
              ))
            )}
          </ul>
          <form onSubmit={send} className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <label className="sr-only" htmlFor="patient-reply">
              {t("replyLabel")}
            </label>
            <input
              id="patient-reply"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("replyPlaceholder")}
              className="min-h-11 flex-1 border border-rule px-3 text-[14px] focus:border-brand"
            />
            <button
              type="submit"
              disabled={sending}
              className="min-h-11 bg-brand px-5 text-[14px] font-semibold text-white hover:bg-brand-dark disabled:opacity-80"
            >
              {sending ? t("sending") : t("send")}
            </button>
          </form>
        </div>
      )}
    </Panel>
  );
}

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}