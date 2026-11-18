export type NavKey = "home" | "doctors" | "howItWorks" | "pricing" | "crisis" | "about";

export const NAV: { key: NavKey; href: string }[] = [
  { key: "home", href: "/" },
  { key: "doctors", href: "/doctors" },
  { key: "howItWorks", href: "/how-it-works" },
  { key: "pricing", href: "/pricing" },
  { key: "crisis", href: "/crisis" },
  { key: "about", href: "/about" },
];