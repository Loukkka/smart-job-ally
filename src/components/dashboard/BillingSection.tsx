"use client";

import { useState } from "react";
import { Check, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useStore } from "@/lib/store";
import { PLAN_LIST, PLANS } from "@/lib/plans";
import type { PlanId } from "@/lib/types";
import { startCheckout } from "@/lib/checkout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function BillingSection() {
  const { plan, subscription, user, isPro, activatePlan, cancelSubscription } = useStore();
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

  const upgrade = async (id: PlanId) => {
    if (id === "Free") {
      cancelSubscription();
      toast.success("Abonnement annulé. Vous êtes repassé en Free.");
      return;
    }
    try {
      setLoadingPlan(id);
      await startCheckout(id, user?.email);
    } catch (e) {
      setLoadingPlan(null);
      toast.error(e instanceof Error ? e.message : "Erreur de paiement.");
    }
  };

  const current = PLANS[plan];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Abonnement & facturation</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gérez votre plan. Le paiement est sécurisé par Stripe.
        </p>
      </div>

      {/* Plan actuel */}
      <div className="mb-8 rounded-2xl border border-border bg-gradient-to-br from-card to-accent/30 p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Plan actuel</div>
              <div className="text-lg font-semibold">{current.name}</div>
            </div>
          </div>
          <Badge variant={isPro ? "success" : "secondary"}>
            {isPro ? "Actif" : "Gratuit"}
          </Badge>
        </div>
        {isPro && subscription.since && (
          <p className="mt-3 text-xs text-muted-foreground">
            Actif depuis le {new Date(subscription.since).toLocaleDateString("fr-FR")} ·
            {subscription.provider === "stripe" ? " payé via Stripe" : " mode démo"}
          </p>
        )}
        {isPro && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              cancelSubscription();
              toast.success("Abonnement annulé. Retour au plan Free.");
            }}
          >
            Annuler l&apos;abonnement
          </Button>
        )}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLAN_LIST.map((p) => {
          const isCurrent = plan === p.id;
          const loading = loadingPlan === p.id;
          return (
            <div
              key={p.id}
              className={`relative rounded-2xl border p-6 ${
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
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
                <span className="text-sm text-muted-foreground">{p.period}</span>
              </div>
              <Button
                className={`mt-5 w-full ${p.highlight ? "bg-gradient-primary shadow-glow hover:opacity-95" : ""}`}
                variant={p.highlight ? "default" : "outline"}
                disabled={isCurrent || loading}
                onClick={() => upgrade(p.id)}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Redirection…
                  </>
                ) : isCurrent ? (
                  "Plan actuel"
                ) : p.id === "Free" ? (
                  "Repasser en Free"
                ) : (
                  p.cta
                )}
              </Button>
              <ul className="mt-5 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Paiements traités par Stripe. Aucune carte requise en mode démo.
      </p>
    </div>
  );
}
