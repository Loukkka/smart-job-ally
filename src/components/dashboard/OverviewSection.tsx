"use client";

import { Send, Eye, MessageSquare, TrendingUp, Briefcase, ArrowUpRight, FileText, Mail } from "lucide-react";
import { toast } from "sonner";

import { useStore } from "@/lib/store";
import type { ApplicationStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { DashboardView } from "./views";

const STATUS_FLOW: ApplicationStatus[] = ["Envoyé", "Vu", "Entretien", "Offre", "Refus"];

function statusVariant(s: ApplicationStatus) {
  if (s === "Entretien" || s === "Offre") return "success" as const;
  if (s === "Refus") return "destructive" as const;
  if (s === "Vu") return "default" as const;
  return "secondary" as const;
}

export function OverviewSection({ onNavigate }: { onNavigate: (v: DashboardView) => void }) {
  const { user, resumes, letters, applications, setApplicationStatus } = useStore();

  const interviews = applications.filter((a) => a.status === "Entretien" || a.status === "Offre").length;
  const seen = applications.filter((a) => a.status === "Vu").length;
  const avgAts = resumes.length
    ? Math.round(resumes.reduce((acc, r) => acc + r.atsScore, 0) / resumes.length)
    : 0;

  const stats = [
    { label: "Candidatures", value: applications.length, icon: Send, tone: "text-primary" },
    { label: "Vues recruteurs", value: seen, icon: Eye, tone: "text-primary" },
    { label: "Entretiens", value: interviews, icon: MessageSquare, tone: "text-success" },
    { label: "Score ATS moyen", value: avgAts, icon: TrendingUp, tone: "text-success" },
  ];

  const cycleStatus = (id: string, current: ApplicationStatus) => {
    const idx = STATUS_FLOW.indexOf(current);
    const next = STATUS_FLOW[(idx + 1) % STATUS_FLOW.length];
    setApplicationStatus(id, next);
    toast.success(`Statut mis à jour : ${next}`);
  };

  const firstName = user?.name?.split(" ")[0] ?? "vous";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Bonjour {firstName} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Voici l&apos;état de votre recherche d&apos;emploi.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.tone}`} />
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Applications */}
        <div className="rounded-xl border border-border bg-card shadow-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="text-base font-semibold">Candidatures récentes</h2>
              <p className="text-xs text-muted-foreground">Cliquez sur un statut pour le faire évoluer.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("offers")}>
              Trouver des offres <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>

          {applications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Aucune candidature. Lancez l&apos;Auto-Apply ou parcourez les offres.
              <div className="mt-4 flex justify-center gap-2">
                <Button size="sm" className="bg-gradient-primary shadow-glow hover:opacity-95" onClick={() => onNavigate("autoapply")}>
                  Auto-Apply
                </Button>
                <Button size="sm" variant="outline" onClick={() => onNavigate("offers")}>
                  Voir les offres
                </Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {applications.slice(0, 6).map((a) => (
                <div key={a.id} className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{a.role}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.company} · {a.match}% match
                      </div>
                    </div>
                  </div>
                  <button onClick={() => cycleStatus(a.id, a.status)} title="Changer le statut">
                    <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shortcuts */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-gradient-to-br from-card to-accent/30 p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Score ATS moyen</h2>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-semibold tracking-tight text-gradient">{avgAts}</span>
              <span className="mb-1 text-sm text-muted-foreground">/ 100</span>
            </div>
            <Progress value={avgAts} className="mt-3" />
            <p className="mt-3 text-xs text-muted-foreground">
              {avgAts >= 85
                ? "Excellent ! Vos CV passent la plupart des filtres ATS."
                : "Créez un CV ou analysez-le pour améliorer votre score."}
            </p>
            <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => onNavigate("ats")}>
              Ouvrir l&apos;ATS Checker
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-base font-semibold">Raccourcis</h2>
            <div className="mt-4 space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate("resumes")}>
                <FileText className="mr-2 h-4 w-4" /> Mes CV ({resumes.length})
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate("letters")}>
                <Mail className="mr-2 h-4 w-4" /> Lettres ({letters.length})
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate("interview")}>
                <MessageSquare className="mr-2 h-4 w-4" /> Mock Interview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
