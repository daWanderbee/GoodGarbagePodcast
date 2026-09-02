import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEpisodes } from "@/lib/get-episodes";
import { readOverrides, studioKeyValid } from "@/lib/overrides";
import { StudioClient } from "./StudioClient";

// Never cached and never indexed: this page is only as private as its URL.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function StudioPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!studioKeyValid(key)) notFound();

  const [episodes, overrides] = await Promise.all([getEpisodes(), readOverrides()]);
  return <StudioClient studioKey={key} episodes={episodes} overrides={overrides} />;
}
