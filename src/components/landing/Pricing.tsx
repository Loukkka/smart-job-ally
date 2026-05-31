import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "0€",
    period: "/ pour toujours",
    desc: "Pour découvrir la plateforme.",
    cta: "Commencer",
    highlight: false,
    features: ["3 CV générés / mois", "3 lettres de motivation", "10 offres recommandées", "Accès limité au mock interview"],
  },
  {
    name: "Pro",
    price: "39$",
    period: "/ mois",
    desc: "Pour décrocher rapidement.",
    cta: "Passer Pro",
    highlight: true,
    features: [
      "Générations CV & lettres illimitées",
      "Auto-Apply (50+ offres / jour)",
      "ATS scoring avancé",
      "Mock interviews illimités",
      "AI Career Coach 24/7",
      "Support prioritaire",
    ],
  },
  {
    name: "Annuel",
    price: "144$",
    period: "/ an",
    desc: "Économisez 70% vs mensuel.",
    cta: "Choisir l'annuel",
    highlight: false,
    features: ["Tout du plan Pro", "2 mois offerts", "Coaching prioritaire", "Accès anticipé aux nouveautés"],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-medium text-primary">Tarifs</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Simple, transparent, sans engagement
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Commencez gratuitement. Passez Pro quand vous voulez accélérer.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border p-8 ${
                p.highlight
                  ? "border-primary/40 bg-gradient-to-b from-card to-accent/30 shadow-glow"
                  : "border-border bg-card shadow-card"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-glow">
                  Le plus populaire
                </div>
              )}
              <div className="text-sm font-medium text-muted-foreground">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <Button
                className={`mt-6 w-full ${p.highlight ? "bg-gradient-primary shadow-glow hover:opacity-95" : ""}`}
                variant={p.highlight ? "default" : "outline"}
              >
                {p.cta}
              </Button>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
