"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

function Chevron({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      className={`size-3.5 ${direction === "down" ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 15 L12 10 L17 15" />
    </svg>
  );
}

const buttonClass =
  "grid size-8 place-items-center rounded-full border border-[#dcdcdc] bg-white/95 text-[#5c5c5c] shadow-[0_1px_6px_rgba(0,0,0,0.07)] transition hover:border-brand/30 hover:bg-[#fafafa] hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export function ScrollControls() {
  const t = useTranslations("scroll");
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      setShowTop(scrollY > 200);
      setShowBottom(max > 320 && scrollY < max - 120);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  if (!showTop && !showBottom) return null;

  return (
    <div className="pointer-events-none fixed end-3 bottom-14 z-40 flex flex-col gap-1.5 sm:end-4 sm:bottom-16">
      {showTop && (
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={`pointer-events-auto ${buttonClass}`} aria-label={t("top")} title={t("top")}>
          <Chevron direction="up" />
        </button>
      )}
      {showBottom && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })}
          className={`pointer-events-auto ${buttonClass}`}
          aria-label={t("bottom")}
          title={t("bottom")}
        >
          <Chevron direction="down" />
        </button>
      )}
    </div>
  );
}