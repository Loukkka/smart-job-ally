"use client";

import { useState } from "react";
import { Mail, Plus, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";

import { useStore } from "@/lib/store";
import { PLANS } from "@/lib/plans";
import type { CoverLetter } from "@/lib/types";
import type { DashboardView } from "./views";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TONES: CoverLetter["tone"][] = ["Formel", "Créatif", "Technique"];

export function LettersSection({ onNavigate }: { onNavigate: (v: DashboardView) => void }) {
  const { letters, addLetter, removeLetter, canCreateLetter, plan, isPro } = useStore();
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [tone, setTone] = useState<CoverLetter["tone"]>("Formel");
  const [preview, setPreview] = useState<CoverLetter | null>(null);

  const limit = PLANS[plan].limits.letters;

  const openCreate = () => {
    if (!canCreateLetter()) {
      toast.error(`Limite atteinte (${limit} lettres en plan ${plan}). Passez Pro pour l'illimité.`);
      onNavigate("billing");
      return;
    }
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      toast.error("Renseignez l'entreprise et le poste.");
      return;
    }
    const l = addLetter({ company, role, tone });
    if (!l) {
      toast.error("Limite de lettres atteinte. Passez Pro pour continuer.");
      setOpen(false);
      onNavigate("billing");
      return;
    }
    toast.success("Lettre générée.");
    setCompany("");
    setRole("");
    setTone("Formel");
    setOpen(false);
    setPreview(l);
  };

  const copy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Lettre copiée dans le presse-papiers.");
    } catch {
      toast.error("Copie impossible sur ce navigateur.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Lettres de motivation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Générez des lettres personnalisées au ton de votre choix.
            {!isPro && limit !== -1 && (
              <> · <span className="font-medium text-foreground">{letters.length}/{limit}</span> utilisées (plan {plan})</>
            )}
          </p>
        </div>
        <Button
          className="bg-gradient-primary shadow-glow hover:opacity-95"
          onClick={openCreate}
        >
          <Plus className="mr-1 h-4 w-4" /> Nouvelle lettre
        </Button>
      </div>

      {letters.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <Mail className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            Aucune lettre. Générez-en une adaptée à une offre précise.
          </p>
          <Button className="mt-4" variant="outline" onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" /> Créer une lettre
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {letters.map((l) => (
            <div key={l.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{l.role}</h3>
                  <p className="text-xs text-muted-foreground">{l.company}</p>
                </div>
                <Badge variant="secondary">{l.tone}</Badge>
              </div>
              <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">
                {l.content}
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setPreview(l)}>
                  Lire
                </Button>
                <Button size="sm" variant="outline" onClick={() => copy(l.content)}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    removeLetter(l.id);
                    toast.success("Lettre supprimée.");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle lettre</DialogTitle>
            <DialogDescription>La lettre est générée selon le ton choisi.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lt-company">Entreprise</Label>
              <Input
                id="lt-company"
                placeholder="Linear"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lt-role">Poste</Label>
              <Input
                id="lt-role"
                placeholder="Product Designer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Ton</Label>
              <div className="flex gap-2">
                {TONES.map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant={tone === t ? "default" : "outline"}
                    size="sm"
                    className={tone === t ? "bg-gradient-primary" : ""}
                    onClick={() => setTone(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-primary shadow-glow hover:opacity-95">
              Générer la lettre
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview dialog */}
      <Dialog open={!!preview} onOpenChange={(v) => !v && setPreview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{preview?.role}</DialogTitle>
            <DialogDescription>{preview?.company} · ton {preview?.tone}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[50vh] overflow-y-auto whitespace-pre-line rounded-lg border border-border bg-muted/30 p-4 text-sm">
            {preview?.content}
          </div>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => preview && copy(preview.content)}
          >
            <Copy className="mr-1 h-4 w-4" /> Copier
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
