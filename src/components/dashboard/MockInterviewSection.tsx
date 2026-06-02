"use client";

import { useRef, useState } from "react";
import { Mic, Send } from "lucide-react";

import type { InterviewMessage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QUESTIONS = [
  "Parlez-moi de vous et de votre parcours en quelques phrases.",
  "Quelle est votre plus grande réussite professionnelle ?",
  "Pourquoi souhaitez-vous rejoindre notre entreprise ?",
  "Décrivez une situation difficile et comment vous l'avez gérée.",
  "Où vous voyez-vous dans 5 ans ?",
  "Quelles sont vos principales forces et axes d'amélioration ?",
];

function feedbackFor(answer: string): string {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  if (words < 8) {
    return "Réponse un peu courte — développez avec un exemple concret (méthode STAR : Situation, Tâche, Action, Résultat).";
  }
  if (words > 120) {
    return "Bonne matière ! Pensez à synthétiser : allez à l'essentiel pour garder l'attention du recruteur.";
  }
  return "Réponse claire et bien calibrée. Ajoutez si possible un chiffre ou un résultat mesurable pour renforcer l'impact.";
}

export function MockInterviewSection() {
  const [messages, setMessages] = useState<InterviewMessage[]>([
    { role: "ai", content: QUESTIONS[0] },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = input.trim();
    if (!answer) return;

    const next: InterviewMessage[] = [
      ...messages,
      { role: "user", content: answer },
      { role: "ai", content: `💡 ${feedbackFor(answer)}` },
    ];

    const nextStep = step + 1;
    if (nextStep < QUESTIONS.length) {
      next.push({ role: "ai", content: QUESTIONS[nextStep] });
      setStep(nextStep);
    } else {
      next.push({
        role: "ai",
        content: "🎉 Entretien terminé ! Vous avez répondu à toutes les questions. Relancez la session pour vous réentraîner.",
      });
    }

    setMessages(next);
    setInput("");
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const restart = () => {
    setMessages([{ role: "ai", content: QUESTIONS[0] }]);
    setStep(0);
    setInput("");
  };

  const finished = step >= QUESTIONS.length - 1 && messages.some((m) => m.content.startsWith("🎉"));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mock Interview IA</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Entraînez-vous et recevez un feedback instantané sur chaque réponse.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={restart}>
          Recommencer
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
            <Mic className="h-4 w-4" />
          </div>
          <div className="text-sm font-medium">Recruteur IA</div>
          <div className="ml-auto text-xs text-muted-foreground">
            Question {Math.min(step + 1, QUESTIONS.length)} / {QUESTIONS.length}
          </div>
        </div>

        <div className="max-h-[45vh] space-y-3 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-gradient-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={send} className="flex gap-2 border-t border-border p-4">
          <Input
            placeholder={finished ? "Session terminée — recommencez pour continuer" : "Tapez votre réponse..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={finished}
          />
          <Button
            type="submit"
            className="bg-gradient-primary shadow-glow hover:opacity-95"
            disabled={finished}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
