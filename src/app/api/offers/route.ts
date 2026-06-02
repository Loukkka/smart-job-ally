import { NextResponse } from "next/server";
import { OFFERS as FALLBACK } from "@/lib/offers";
import type { JobOffer } from "@/lib/types";

// Revalide côté serveur toutes les 30 min (vraies offres, mises en cache).
export const revalidate = 1800;

interface RemotiveJob {
  id: number;
  title: string;
  company_name: string;
  candidate_required_location: string;
  salary: string;
  description: string;
  tags?: string[];
  job_type?: string;
  url: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// Score de match déterministe (l'id Remotive sert de graine) → stable entre rendus.
function pseudoMatch(seed: number): number {
  return 78 + (seed % 21); // 78–98
}

function mapRemotive(j: RemotiveJob): JobOffer {
  const desc = stripHtml(j.description || "");
  return {
    id: `rmt-${j.id}`,
    title: j.title,
    company: j.company_name,
    location: j.candidate_required_location || "Remote",
    salary: j.salary?.trim() || "Non précisé",
    match: pseudoMatch(j.id),
    tags: (j.tags || []).slice(0, 3).map((t) => t.replace(/-/g, " ")),
    description: desc.length > 320 ? `${desc.slice(0, 320)}…` : desc || "Voir l'offre complète sur Remotive.",
    url: j.url,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const limit = Math.min(Number(searchParams.get("limit")) || 24, 50);

  try {
    const api = new URL("https://remotive.com/api/remote-jobs");
    if (search) api.searchParams.set("search", search);
    api.searchParams.set("limit", String(limit));

    const res = await fetch(api.toString(), {
      headers: { Accept: "application/json", "User-Agent": "Hirewise/1.0" },
      next: { revalidate: 1800 },
    });

    if (!res.ok) throw new Error(`Remotive ${res.status}`);

    const data = (await res.json()) as { jobs?: RemotiveJob[] };
    const jobs = (data.jobs ?? [])
      .filter((j) => j.title && j.company_name)
      .slice(0, limit)
      .map(mapRemotive)
      .sort((a, b) => b.match - a.match);

    if (jobs.length === 0) {
      return NextResponse.json({ offers: FALLBACK, source: "fallback" });
    }
    return NextResponse.json({ offers: jobs, source: "remotive" });
  } catch {
    // API indisponible → on sert le catalogue local pour que l'app reste utilisable.
    const q = search.toLowerCase();
    const offers = q
      ? FALLBACK.filter(
          (o) =>
            o.title.toLowerCase().includes(q) ||
            o.company.toLowerCase().includes(q) ||
            o.tags.some((t) => t.toLowerCase().includes(q))
        )
      : FALLBACK;
    return NextResponse.json({ offers, source: "fallback" });
  }
}
