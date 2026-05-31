import Link from "next/link";
import {
  LayoutDashboard, FileText, Mail, Briefcase, Send, Mic, ShieldCheck,
  Sparkles, ArrowUpRight, Plus, TrendingUp, Eye, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const metadata = {
  title: "Dashboard — Hirewise",
  description: "Vue d'ensemble de vos candidatures, CV et entretiens.",
};

const nav = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: FileText, label: "Mes CV" },
  { icon: Mail, label: "Lettres" },
  { icon: Briefcase, label: "Offres" },
  { icon: Send, label: "Auto-Apply" },
  { icon: Mic, label: "Mock Interview" },
  { icon: ShieldCheck, label: "ATS Checker" },
];

const stats = [
  { label: "Candidatures", value: "47", change: "+12", icon: Send, tone: "text-primary" },
  { label: "Vues recruteurs", value: "23", change: "+8", icon: Eye, tone: "text-primary" },
  { label: "Entretiens", value: "9", change: "+3", icon: MessageSquare, tone: "text-success" },
  { label: "Score ATS moyen", value: "92", change: "+5", icon: TrendingUp, tone: "text-success" },
];

const applications = [
  { role: "Senior Product Designer", company: "Linear", status: "Entretien", date: "Il y a 2j", match: 98, tone: "bg-success/15 text-success" },
  { role: "Full-Stack Engineer", company: "Vercel", status: "Vu", date: "Il y a 3j", match: 94, tone: "bg-primary/15 text-primary" },
  { role: "UX Lead", company: "Notion", status: "Envoyé", date: "Il y a 4j", match: 91, tone: "bg-muted text-muted-foreground" },
  { role: "Product Manager", company: "Stripe", status: "Vu", date: "Il y a 5j", match: 88, tone: "bg-primary/15 text-primary" },
  { role: "Frontend Engineer", company: "Figma", status: "Refus", date: "Il y a 6j", match: 85, tone: "bg-destructive/15 text-destructive" },
];

const recommended = [
  { t: "Staff Designer", c: "Arc Browser", s: "€95-120k · Remote", m: 96 },
  { t: "Senior Engineer", c: "Raycast", s: "€85-110k · Remote EU", m: 93 },
  { t: "Head of Design", c: "Cron", s: "€110-140k · NY", m: 90 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold tracking-tight">Hirewise</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Plus className="mr-1 h-4 w-4" /> Nouveau CV
            </Button>
            <Button size="sm" className="bg-gradient-primary shadow-glow hover:opacity-95">
              <Send className="mr-1 h-4 w-4" /> Auto-Apply
            </Button>
            <div className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-sm font-medium text-primary-foreground">
              SM
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border bg-background p-4 md:block">
          <nav className="space-y-1">
            {nav.map((item) => (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  item.active
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-xl border border-border bg-gradient-to-b from-accent/40 to-card p-4">
            <div className="text-sm font-medium">Plan Free</div>
            <p className="mt-1 text-xs text-muted-foreground">2/3 CV générés ce mois.</p>
            <Progress value={66} className="mt-3" />
            <Button size="sm" className="mt-3 w-full bg-gradient-primary shadow-glow hover:opacity-95">
              Passer Pro
            </Button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 lg:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">Bonjour Sophie 👋</h1>
            <p className="mt-1 text-muted-foreground">Voici l&apos;état de votre recherche d&apos;emploi cette semaine.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <s.icon className={`h-4 w-4 ${s.tone}`} />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight">{s.value}</span>
                  <span className={`text-xs font-medium ${s.tone}`}>{s.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Applications */}
            <div className="rounded-xl border border-border bg-card shadow-card lg:col-span-2">
              <div className="flex items-center justify-between border-b border-border p-5">
                <div>
                  <h2 className="text-base font-semibold">Candidatures récentes</h2>
                  <p className="text-xs text-muted-foreground">Suivi en temps réel des statuts.</p>
                </div>
                <Button variant="ghost" size="sm">Voir tout <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Button>
              </div>
              <div className="divide-y divide-border">
                {applications.map((a) => (
                  <div key={a.role} className="flex items-center justify-between p-5 transition-colors hover:bg-muted/40">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{a.role}</div>
                        <div className="text-xs text-muted-foreground">{a.company} · {a.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Match</div>
                        <div className="text-sm font-medium">{a.match}%</div>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${a.tone}`}>{a.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ATS card */}
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-gradient-to-br from-card to-accent/30 p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">Score ATS</h2>
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-5xl font-semibold tracking-tight text-gradient">92</span>
                  <span className="mb-1 text-sm text-muted-foreground">/ 100</span>
                </div>
                <Progress value={92} className="mt-3" />
                <p className="mt-3 text-xs text-muted-foreground">Excellent ! Votre CV passe la plupart des filtres ATS.</p>
                <Button variant="outline" size="sm" className="mt-4 w-full">Voir les recommandations</Button>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h2 className="text-base font-semibold">Offres pour vous</h2>
                <div className="mt-4 space-y-3">
                  {recommended.map((r) => (
                    <div key={r.t} className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{r.t}</div>
                        <div className="truncate text-xs text-muted-foreground">{r.c} · {r.s}</div>
                      </div>
                      <span className="rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">{r.m}%</span>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="mt-3 w-full">Voir toutes les offres</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
