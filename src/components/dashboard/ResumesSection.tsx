"use client";

import { useState } from "react";
import { FileText, Plus, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ResumesSection() {
  const { resumes, addResume, removeResume } = useStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");

  const reset = () => {
    setTitle("");
    setRole("");
    setSummary("");
    setSkills("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) {
      toast.error("Indiquez au moins le poste visé.");
      return;
    }
    const r = addResume({ title, role, summary, skills });
    toast.success(`CV créé · score ATS ${r.atsScore}/100`);
    reset();
    setOpen(false);
  };

  const download = (id: string) => {
    const r = resumes.find((x) => x.id === id);
    if (!r) return;
    const text = `${r.title}\n${"=".repeat(r.title.length)}\n\nPoste : ${r.role}\nScore ATS : ${r.atsScore}/100\n\nRÉSUMÉ\n${r.summary}\n\nCOMPÉTENCES\n${r.skills.join(", ")}\n`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${r.title.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CV téléchargé.");
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mes CV</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Générez et gérez des CV optimisés ATS.
          </p>
        </div>
        <Button
          className="bg-gradient-primary shadow-glow hover:opacity-95"
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-1 h-4 w-4" /> Nouveau CV
        </Button>
      </div>

      {resumes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            Aucun CV pour l&apos;instant. Créez votre premier CV en quelques secondes.
          </p>
          <Button className="mt-4" variant="outline" onClick={() => setOpen(true)}>
            <Plus className="mr-1 h-4 w-4" /> Créer un CV
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <Badge variant={r.atsScore >= 85 ? "success" : "default"}>
                  ATS {r.atsScore}
                </Badge>
              </div>
              <h3 className="mt-3 font-medium">{r.title}</h3>
              <p className="text-xs text-muted-foreground">{r.role}</p>
              <Progress value={r.atsScore} className="mt-3" />
              <div className="mt-3 flex flex-wrap gap-1">
                {r.skills.slice(0, 4).map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => download(r.id)}>
                  <Download className="mr-1 h-3.5 w-3.5" /> Export
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    removeResume(r.id);
                    toast.success("CV supprimé.");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau CV</DialogTitle>
            <DialogDescription>
              Renseignez vos infos — laissez le résumé vide pour le générer automatiquement.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cv-title">Titre du CV</Label>
              <Input
                id="cv-title"
                placeholder="CV Product Designer 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cv-role">Poste visé *</Label>
              <Input
                id="cv-role"
                placeholder="Product Designer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cv-skills">Compétences (séparées par des virgules)</Label>
              <Input
                id="cv-skills"
                placeholder="Figma, Design System, UX Research"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cv-summary">Résumé (optionnel)</Label>
              <Textarea
                id="cv-summary"
                placeholder="Laissez vide pour une génération IA automatique..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary shadow-glow hover:opacity-95">
              Générer le CV
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
