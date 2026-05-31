import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 grid-bg" />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground shadow-card backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Propulsé par l'IA · Nouvelle version 2026
          </div>

          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
            Décrochez votre prochain job{" "}
            <span className="text-gradient">10× plus vite</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Hirewise génère des CV optimisés ATS, postule à votre place et vous prépare aux entretiens.
            Une seule plateforme, des résultats mesurables.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="h-12 bg-gradient-primary px-6 text-base shadow-glow hover:opacity-95" asChild>
              <Link href="/dashboard">
                Démarrer gratuitement
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 text-base">
              Voir une démo
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Sans carte bancaire</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> 3 CV gratuits / mois</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" /> Annulation à tout moment</span>
          </div>
        </div>

        {/* Dashboard preview mock */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-primary opacity-20 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/40 px-4 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-chart-4/70" style={{ background: "oklch(0.85 0.15 75)" }} />
              <div className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <div className="ml-3 text-xs text-muted-foreground">app.hirewise.io / dashboard</div>
            </div>
            <div className="grid grid-cols-12 gap-4 p-6">
              <div className="col-span-3 space-y-3">
                {["Dashboard", "Mes CV", "Lettres", "Offres", "Auto-Apply", "Mock Interview"].map((label, i) => (
                  <div key={label} className={`rounded-lg px-3 py-2 text-sm ${i === 0 ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"}`}>
                    {label}
                  </div>
                ))}
              </div>
              <div className="col-span-9 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { l: "Candidatures", v: "47", d: "+12 cette semaine" },
                    { l: "Score ATS moyen", v: "92", d: "+8 pts" },
                    { l: "Entretiens", v: "9", d: "Taux 19%" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border border-border bg-gradient-to-b from-card to-muted/30 p-4">
                      <div className="text-xs text-muted-foreground">{s.l}</div>
                      <div className="mt-1 text-2xl font-semibold tracking-tight">{s.v}</div>
                      <div className="mt-1 text-xs text-success">{s.d}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-medium">Offres recommandées pour vous</div>
                    <div className="text-xs text-primary">98% match</div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { t: "Senior Product Designer", c: "Linear", m: "98%" },
                      { t: "Full-Stack Engineer", c: "Vercel", m: "94%" },
                      { t: "UX Lead", c: "Notion", m: "91%" },
                    ].map((j) => (
                      <div key={j.t} className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-sm">
                        <div>
                          <div className="font-medium">{j.t}</div>
                          <div className="text-xs text-muted-foreground">{j.c} · Remote · €70-90k</div>
                        </div>
                        <div className="rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">{j.m}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
