"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

type Props = {
  id: string;
  label?: string;
  placeholder: string;
  value: string;
  onChange: (html: string) => void;
};

export function CompactRichTextEditor({ id, label, placeholder, value, onChange }: Props) {
  const t = useTranslations("patientCases.editor");
  const editor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editor.current && editor.current.innerHTML !== value) editor.current.innerHTML = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sync() {
    onChange(editor.current?.innerHTML ?? "");
  }

  function run(command: string, value?: string) {
    editor.current?.focus();
    document.execCommand(command, false, value);
    sync();
  }

  function addLink() {
    editor.current?.focus();
    const url = window.prompt(t("linkPrompt"), "https://");
    if (!url || !/^https?:\/\//i.test(url.trim())) return;
    document.execCommand("createLink", false, url.trim());
    sync();
  }

  function paste(event: React.ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
    sync();
  }

  return (
    <div>
      {label ? (
        <label className="mb-1 block text-[13px] font-semibold text-text" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <div className="overflow-hidden border border-rule bg-white focus-within:border-brand">
        <div role="toolbar" aria-label={t("toolbar")} className="flex flex-wrap gap-1 border-b border-rule bg-panel-head px-2 py-1.5">
          {(["bold", "italic", "underline"] as const).map((cmd) => (
            <button
              key={cmd}
              type="button"
              title={t(cmd)}
              aria-label={t(cmd)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => run(cmd)}
              className="flex h-8 min-w-8 items-center justify-center px-1.5 text-muted hover:bg-white hover:text-text"
            >
              <span className={`text-[15px] ${cmd === "bold" ? "font-bold" : cmd === "italic" ? "italic" : "underline"}`}>
                {cmd === "bold" ? "B" : cmd === "italic" ? "I" : "U"}
              </span>
            </button>
          ))}
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={addLink} className="px-2 text-[12px] font-semibold text-muted hover:text-text">
            Link
          </button>
        </div>
        <div
          id={id}
          ref={editor}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline
          data-placeholder={placeholder}
          onInput={sync}
          onPaste={paste}
          className="min-h-28 w-full px-3 py-2.5 text-[15px] leading-relaxed text-text outline-none empty:before:text-muted empty:before:content-[attr(data-placeholder)]"
        />
      </div>
    </div>
  );
}