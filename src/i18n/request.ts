import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

async function loadOptional(path: string) {
  try {
    return (await import(`../../messages/${path}`)).default as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Deep-merge message namespaces so patient-extra can extend base keys. */
function mergeMessages(...parts: Record<string, unknown>[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const part of parts) {
    for (const [key, value] of Object.entries(part)) {
      const existing = out[key];
      if (
        existing &&
        value &&
        typeof existing === "object" &&
        typeof value === "object" &&
        !Array.isArray(existing) &&
        !Array.isArray(value)
      ) {
        out[key] = mergeMessages(existing as Record<string, unknown>, value as Record<string, unknown>);
      } else {
        out[key] = value;
      }
    }
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const [base, clinician, admin, patientExtra] = await Promise.all([
    import(`../../messages/${locale}.json`),
    loadOptional(`clinician/${locale}.json`),
    loadOptional(`admin/${locale}.json`),
    loadOptional(`patient-extra/${locale}.json`),
  ]);

  return {
    locale,
    messages: mergeMessages(base.default as Record<string, unknown>, clinician, admin, patientExtra),
  };
});
