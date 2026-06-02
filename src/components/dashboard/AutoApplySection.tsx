"use client";

import { useState } from "react";
import { Send, Zap } from "lucide-react";
import { toast } from "sonner";

import { useStore } from "@/lib/store";
import { OFFERS } from "@/lib/offers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AutoApplySection() {
  const { autoApply, applications } = useStore();
  const [running, setRunning] = useState(false);
  const remaining = OFFERS.length - applications.length;

  const launch = (count: number) => {
    setRunning(true);
    setTimeout(() => {
      const n = autoApply(count);
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

        <div className="mt-4 flex items-center gap-2">
          <Badge variant="secondary">{remaining} offre{remaining > 1 ? "s" : ""} disponible{remaining > 1 ? "s" : ""}</Badge>
          <Badge>{applications.length} déjà envoyée{applications.length > 1 ? "s" : ""}</Badge>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            className="bg-gradient-primary shadow-glow hover:opacity-95"
            disabled={running || remaining <= 0}
            onClick={() => launch(3)}
          >
            <Send className="mr-1 h-4 w-4" />
            {running ? "Envoi en cours..." : "Postuler à 3 offres"}
          </Button>
          <Button
            variant="outline"
            disabled={running || remaining <= 0}
            onClick={() => launch(remaining)}
          >
            Tout postuler ({remaining})
          </Button>
        </div>
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
