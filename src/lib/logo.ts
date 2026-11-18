import { DEFAULT_LOGO_SETTINGS, type LogoSettings } from "./logo-config";

export async function getLogoSettings(): Promise<LogoSettings> {
  return DEFAULT_LOGO_SETTINGS;
}