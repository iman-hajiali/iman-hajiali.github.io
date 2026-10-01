import Link from "next/link";
import { notFound } from "next/navigation";
import { resume } from "@/content/resume";
export function generateStaticParams() {
  return resume.projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = resume.projects.find((x) => x.slug === slug);
  return { title: p ? `${p.name} — Iman Hajiali` : "Project not found" };
}
export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = resume.projects.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <main className="project-page">
      <Link href="/#work" className="back">
        ← All projects
      </Link>
      <p className="eyebrow">{p.type}</p>
      <h1>{p.name}</h1>
      <p className="lead">{p.summary}</p>
      <p>{p.detail}</p>
      {p.href && (
        <a className="button" href={p.href} target="_blank" rel="noreferrer">
          Visit live project
        </a>
      )}
      <aside className="case-note">Detailed case study in preparation.</aside>
      <Link href="/">Back to resume</Link>
    </main>
  );
}
