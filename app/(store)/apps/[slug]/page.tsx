import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppDetail } from "@/components/store/AppDetail";
import { APPS, getApp } from "@/lib/catalog";
import { fileFacts, type FileFacts } from "@/lib/releases";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return APPS.map((app) => ({ slug: app.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) return { title: "App" };
  return {
    title: app.name,
    description: app.description,
  };
}

export default async function AppPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) notFound();
  const entries = await Promise.all(
    app.files.map(async (file) => [file.filename, await fileFacts(file.filename)] as const),
  );
  const facts: Record<string, FileFacts> = Object.fromEntries(entries);
  return <AppDetail app={app} facts={facts} />;
}
