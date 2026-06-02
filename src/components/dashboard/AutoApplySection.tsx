"use client";

import { useEffect, useState } from "react";
import { Send, Zap, Loader2, Crown } from "lucide-react";
import { toast } from "sonner";

import { useStore } from "@/lib/store";
import type { DashboardView } from "./views";
import type { JobOffer } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AutoApplySection({ onNavigate }: { onNavigate: (v: DashboardView) => void }) {
  const { autoApply, applications, autoApplyLimit, isPro } = useStore();
  const [pool, setPool] = useState<JobOffer[]>([]);
  const [loadingPool, setLoadingPool] = useState(true);
  const [running, setRunning] = useState(false);

  const limit = autoApplyLimit();

  // Charge les vraies offres pour alimenter la campagne.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/offers?limit=50");
        const data = (await res.json()) as { offers: JobOffer[] };
        if (active) setPool(data.offers ?? []);
      } catch {
        if (active) setPool([]);
      } finally {
        if (active) setLoadingPool(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const appliedIds = new Set(applications.map((a) => a.offerId));
  const remaining = pool.filter((o) => !appliedIds.has(o.id)).length;

  const launch = (count: number) => {
    setRunning(true);
    setTimeout(() => {
      const n = autoApply(pool, count);
      setRunning(false);
      if (n === 0) toast.error("Plus aucune offre disponible à postuler.");
      else toast.success(`Auto-Apply : ${n} candidature${n > 1 ? "s" : ""} envoyée${n > 1 ? "s" : ""} !`);
    }, 700);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Auto-Apply Engine</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Postulez automatiquement aux meilleures offres correspondant à votre profil.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-accent/30 p-8 shadow-card">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Zap className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">Lancer une campagne</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Hirewise sélectionne les offres avec le meilleur score de match et postule pour vous,
          CV et lettre adaptés automatiquement.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {loadingPool ? "Chargement…" : `${remaining} offre${remaining > 1 ? "s" : ""} disponible${remaining > 1 ? "s" : ""}`}
          </Badge>
          <Badge>{applications.length} déjà envoyée{applications.length > 1 ? "s" : ""}</Badge>
          <Badge variant={isPro ? "success" : "secondary"}>
            {isPro ? "Pro · jusqu'à 50 / campagne" : `Free · max ${limit} / campagne`}
          </Badge>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            className="bg-gradient-primary shadow-glow hover:opacity-95"
            disabled={running || loadingPool || remaining <= 0}
            onClick={() => launch(Math.min(3, limit))}
          >
            {running ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Send className="mr-1 h-4 w-4" />}
            {running ? "Envoi en cours..." : `Postuler à ${Math.min(3, limit)} offres`}
          </Button>
          <Button
            variant="outline"
            disabled={running || loadingPool || remaining <= 0}
            onClick={() => launch(Math.min(remaining, limit))}
          >
            Campagne complète ({Math.min(remaining, limit)})
          </Button>
        </div>

        {!isPro && (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
            <p className="text-xs text-muted-foreground">
              <Crown className="mr-1 inline h-3.5 w-3.5 text-primary" />
              Passez Pro pour postuler jusqu&apos;à 50 offres par campagne.
            </p>
            <Button size="sm" variant="outline" onClick={() => onNavigate("billing")}>
              Passer Pro
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { t: "CV adapté", d: "Un CV optimisé est joint à chaque candidature." },
          { t: "Lettre générée", d: "Une lettre personnalisée par entreprise." },
          { t: "Suivi automatique", d: "Statuts mis à jour dans vos candidatures." },
        ].map((f) => (
          <div key={f.t} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-medium">{f.t}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
