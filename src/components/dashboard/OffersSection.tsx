"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Briefcase, Loader2, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { useStore } from "@/lib/store";
import { useCallbackRef } from "@/lib/use-callback-ref";
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
  const [debounced, setDebounced] = useState("");
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>("");
  const [selected, setSelected] = useState<JobOffer | null>(null);

  // Debounce la recherche pour limiter les appels API.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 450);
    return () => clearTimeout(t);
  }, [query]);

  const fetchOffers = useCallbackRef(async (search: string) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (search) qs.set("search", search);
      const res = await fetch(`/api/offers?${qs.toString()}`);
      const data = (await res.json()) as { offers: JobOffer[]; source: string };
      setOffers(data.offers ?? []);
      setSource(data.source ?? "");
    } catch {
      toast.error("Impossible de charger les offres.");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchOffers(debounced);
  }, [debounced, fetchOffers]);

  const doApply = (offer: JobOffer) => {
    const ok = apply(offer);
    toast[ok ? "success" : "error"](
      ok ? `Candidature envoyée chez ${offer.company} !` : "Vous avez déjà postulé à cette offre."
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Offres d&apos;emploi réelles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {source === "remotive"
              ? "Offres en temps réel via Remotive — classées par compatibilité."
              : "Offres recommandées, classées par compatibilité."}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchOffers(debounced)} disabled={loading}>
          <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Actualiser
        </Button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Rechercher un poste, une techno (ex. React, Designer)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Chargement des offres…
        </div>
      ) : offers.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune offre ne correspond à votre recherche.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((o) => {
            const applied = hasApplied(o.id);
            return (
              <div key={o.id} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <Badge variant="success">{o.match}% match</Badge>
                </div>
                <h3 className="mt-3 font-medium leading-snug">{o.title}</h3>
                <p className="text-xs text-muted-foreground">{o.company}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {o.location} · {o.salary}
                </div>
                {o.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {o.tags.map((t) => (
                      <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                )}
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
          <p className="max-h-[40vh] overflow-y-auto text-sm text-muted-foreground">
            {selected?.description}
          </p>
          {selected && selected.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selected.tags.map((t) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            {selected?.url && (
              <Button variant="outline" className="flex-1" asChild>
                <a href={selected.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-1 h-4 w-4" /> Voir l&apos;offre
                </a>
              </Button>
            )}
            {selected && (
              <Button
                className="flex-1 bg-gradient-primary shadow-glow hover:opacity-95"
                disabled={hasApplied(selected.id)}
                onClick={() => {
                  doApply(selected);
                  setSelected(null);
                }}
              >
                {hasApplied(selected.id) ? "Déjà postulé" : "Postuler"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
