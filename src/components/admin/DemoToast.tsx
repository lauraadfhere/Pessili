"use client";

export function DemoToast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed bottom-6 start-1/2 z-[80] max-w-md -translate-x-1/2 border border-brand/30 bg-white px-4 py-3 text-[13px] text-text shadow-[0_8px_24px_rgba(0,0,0,0.12)] rtl:translate-x-1/2"
    >
      {message}
    </div>
  );
}
