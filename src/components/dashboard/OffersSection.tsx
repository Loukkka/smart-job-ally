"use client";

import { useMemo, useState } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";
import { toast } from "sonner";

import { useStore } from "@/lib/store";
import { OFFERS } from "@/lib/offers";
import type { JobOffer } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function OffersSection() {
  const { apply, hasApplied } = useStore();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<JobOffer | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...OFFERS].sort((a, b) => b.match - a.match);
    if (!q) return list;
    return list.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.company.toLowerCase().includes(q) ||
        o.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const doApply = (offer: JobOffer) => {
    const ok = apply(offer);
    toast[ok ? "success" : "error"](
      ok ? `Candidature envoyée chez ${offer.company} !` : "Vous avez déjà postulé à cette offre."
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Offres recommandées</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Classées par compatibilité avec votre profil.
        </p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Rechercher un poste, une entreprise, une techno..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune offre ne correspond à votre recherche.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o) => {
            const applied = hasApplied(o.id);
            return (
              <div key={o.id} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <Badge variant="success">{o.match}% match</Badge>
                </div>
                <h3 className="mt-3 font-medium">{o.title}</h3>
                <p className="text-xs text-muted-foreground">{o.company}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {o.location} · {o.salary}
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {o.tags.map((t) => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                </div>
                <div className="mt-4 flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelected(o)}>
                    Détails
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-primary shadow-glow hover:opacity-95"
                    disabled={applied}
                    onClick={() => doApply(o)}
                  >
                    {applied ? "Postulé ✓" : "Postuler"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              {selected?.company} · {selected?.location} · {selected?.salary}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{selected?.description}</p>
          <div className="flex flex-wrap gap-1">
            {selected?.tags.map((t) => (
              <Badge key={t} variant="secondary">{t}</Badge>
            ))}
          </div>
          {selected && (
            <Button
              className="w-full bg-gradient-primary shadow-glow hover:opacity-95"
              disabled={hasApplied(selected.id)}
              onClick={() => {
                doApply(selected);
                setSelected(null);
              }}
            >
              {hasApplied(selected.id) ? "Déjà postulé" : "Postuler maintenant"}
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
