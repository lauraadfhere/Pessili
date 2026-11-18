export type LogoSettings = {
  mode: "text" | "image";
  textShort: string;
  headerUrl: string;
  footerUrl: string;
  headerWidth: number;
  footerWidth: number;
};

export const DEFAULT_LOGO_SETTINGS: LogoSettings = {
  mode: "image",
  textShort: "PeSSiLi",
  headerUrl: "/logo/header.png",
  footerUrl: "/logo/footer.png",
  headerWidth: 140,
  footerWidth: 120,
};