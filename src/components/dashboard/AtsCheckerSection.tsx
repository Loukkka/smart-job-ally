"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const KEYWORDS = [
  "expérience", "compétences", "résultats", "équipe", "projet",
  "gestion", "développement", "objectifs", "clients", "performance",
];

interface Analysis {
  score: number;
  found: string[];
  missing: string[];
  tips: string[];
}

function analyze(text: string): Analysis {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean).length;
  const found = KEYWORDS.filter((k) => lower.includes(k));
  const missing = KEYWORDS.filter((k) => !lower.includes(k));

  let score = 40;
  score += Math.min(found.length * 5, 40);
  score += words > 120 ? 12 : words > 50 ? 6 : 0;
  if (/\d/.test(text)) score += 8; // présence de chiffres / résultats
  score = Math.min(score, 99);

  const tips: string[] = [];
  if (words < 120) tips.push("Étoffez votre CV : visez au moins 150 mots pour couvrir vos expériences.");
  if (!/\d/.test(text)) tips.push("Ajoutez des résultats chiffrés (ex. « +30% de conversion »).");
  if (missing.length) tips.push(`Intégrez des mots-clés pertinents : ${missing.slice(0, 5).join(", ")}.`);
  if (!tips.length) tips.push("Excellent ! Votre CV est bien optimisé pour les ATS.");

  return { score, found, missing, tips };
}

export function AtsCheckerSection() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);

  const run = () => {
    if (!text.trim()) return;
    setResult(analyze(text));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">ATS Checker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Collez le contenu de votre CV pour obtenir un score et des recommandations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <Textarea
            className="min-h-[260px]"
            placeholder="Collez ici le texte de votre CV..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            className="mt-4 w-full bg-gradient-primary shadow-glow hover:opacity-95"
            onClick={run}
            disabled={!text.trim()}
          >
            <ShieldCheck className="mr-1 h-4 w-4" /> Analyser
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          {!result ? (
            <div className="flex h-full min-h-[260px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <ShieldCheck className="mb-3 h-10 w-10" />
              Le résultat de l&apos;analyse s&apos;affichera ici.
            </div>
          ) : (
            <div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-tight text-gradient">{result.score}</span>
                <span className="mb-1 text-sm text-muted-foreground">/ 100</span>
              </div>
              <Progress value={result.score} className="mt-3" />

              <div className="mt-5">
                <h3 className="text-sm font-medium">Mots-clés détectés</h3>
                <div className="mt-2 flex flex-wrap gap-1">
                  {result.found.length ? (
                    result.found.map((k) => <Badge key={k} variant="success">{k}</Badge>)
                  ) : (
                    <span className="text-xs text-muted-foreground">Aucun mot-clé détecté.</span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium">Recommandations</h3>
                <ul className="mt-2 space-y-2">
                  {result.tips.map((t, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-primary">•</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
