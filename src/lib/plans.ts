export type PlanId = "Free" | "Pro" | "Annuel";

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: string;
  priceAmount: number; // en centimes, pour Stripe
  currency: string;
  interval: "month" | "year" | null;
  period: string;
  desc: string;
  cta: string;
  highlight: boolean;
  features: string[];
  // Limites mensuelles (-1 = illimité)
  limits: {
    resumes: number;
    letters: number;
    autoApplyPerRun: number;
  };
}

export const PLANS: Record<PlanId, PlanConfig> = {
  Free: {
    id: "Free",
    name: "Free",
    price: "0€",
    priceAmount: 0,
    currency: "eur",
    interval: null,
    period: "/ pour toujours",
    desc: "Pour découvrir la plateforme.",
    cta: "Commencer",
    highlight: false,
    features: [
      "3 CV générés / mois",
      "3 lettres de motivation",
      "Auto-Apply limité (3 offres)",
      "Accès limité au mock interview",
    ],
    limits: { resumes: 3, letters: 3, autoApplyPerRun: 3 },
  },
  Pro: {
    id: "Pro",
    name: "Pro",
    price: "39€",
    priceAmount: 3900,
    currency: "eur",
    interval: "month",
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
    limits: { resumes: -1, letters: -1, autoApplyPerRun: 50 },
  },
  Annuel: {
    id: "Annuel",
    name: "Annuel",
    price: "144€",
    priceAmount: 14400,
    currency: "eur",
    interval: "year",
    period: "/ an",
    desc: "Économisez 70% vs mensuel.",
    cta: "Choisir l'annuel",
    highlight: false,
    features: [
      "Tout du plan Pro",
      "2 mois offerts",
      "Coaching prioritaire",
      "Accès anticipé aux nouveautés",
    ],
    limits: { resumes: -1, letters: -1, autoApplyPerRun: 50 },
  },
};

export const PLAN_LIST = [PLANS.Free, PLANS.Pro, PLANS.Annuel];

export function isUnlimited(plan: PlanId): boolean {
  return PLANS[plan].limits.resumes === -1;
}
