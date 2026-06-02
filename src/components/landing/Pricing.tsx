"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useStore } from "@/lib/store";
import { PLAN_LIST } from "@/lib/plans";
import type { PlanId } from "@/lib/types";
import { startCheckout } from "@/lib/checkout";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/AuthDialog";

export function Pricing() {
  const { user, plan, activatePlan, hydrated } = useStore();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);

  const choosePlan = async (id: PlanId) => {
    // Non connecté → inscription d'abord.
    if (!hydrated || !user) {
      setAuthOpen(true);
      return;
    }
    // Plan gratuit → activation directe.
    if (id === "Free") {
      activatePlan("Free");
      toast.success("Plan Free activé.");
      router.push("/dashboard");
      return;
    }
    // Plan payant → vrai tunnel de paiement (Stripe ou démo).
    try {
      setLoadingPlan(id);
      await startCheckout(id, user.email);
    } catch (e) {
      setLoadingPlan(null);
      toast.error(e instanceof Error ? e.message : "Erreur de paiement.");
    }
  };

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
          {PLAN_LIST.map((p) => {
            const current = hydrated && !!user && plan === p.id;
            const loading = loadingPlan === p.id;
            return (
              <div
                key={p.id}
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
                  disabled={!!current || loading}
                  onClick={() => choosePlan(p.id)}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Redirection…
                    </>
                  ) : current ? (
                    "Plan actuel"
                  ) : (
                    p.cta
                  )}
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
            );
          })}
        </div>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="signup" />
    </section>
  );
}
