import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; tool: string }>;
};

/** Nested alias → query form used by ScreeningTool. */
export default async function ScreeningToolAliasPage({ params }: Props) {
  const { locale, tool } = await params;
  if (tool === "phq9" || tool === "gad7") {
    redirect(`/${locale}/patient/screening?tool=${tool}`);
  }
  redirect(`/${locale}/patient/screening`);
}
