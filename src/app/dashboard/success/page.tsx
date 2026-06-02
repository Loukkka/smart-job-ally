"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle, Sparkles } from "lucide-react";

import { useStore } from "@/lib/store";
import type { PlanId } from "@/lib/types";
import { Button } from "@/components/ui/button";

function isPlan(v: string | null): v is PlanId {
  return v === "Pro" || v === "Annuel" || v === "Free";
}

function SuccessInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { activatePlan, user, hydrated } = useStore();
  const [state, setState] = useState<"checking" | "ok" | "fail">("checking");

  const planParam = params.get("plan");
  const sessionId = params.get("session_id");
  const demo = params.get("demo");

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/");
      return;
    }
    const plan = isPlan(planParam) && planParam !== "Free" ? planParam : null;
    if (!plan) {
      setState("fail");
      return;
    }

    const verify = async () => {
      try {
        const qs = new URLSearchParams();
        if (sessionId) qs.set("session_id", sessionId);
        if (demo) qs.set("demo", demo);
        const res = await fetch(`/api/checkout/verify?${qs.toString()}`);
        const data = (await res.json()) as { paid: boolean; mode: string };
        if (data.paid) {
          activatePlan(plan, data.mode === "stripe" ? "stripe" : "demo");
          setState("ok");
        } else {
          setState("fail");
        }
      } catch {
        setState("fail");
      }
    };
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-elevated">
        <Link href="/" className="mb-6 inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-base font-semibold tracking-tight">Hirewise</span>
        </Link>

        {state === "checking" && (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <h1 className="mt-4 text-xl font-semibold">Validation du paiement…</h1>
            <p className="mt-2 text-sm text-muted-foreground">Un instant, on confirme votre abonnement.</p>
          </>
        )}

        {state === "ok" && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">Bienvenue dans {planParam} ! 🎉</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Votre abonnement est actif. Générations illimitées et Auto-Apply étendu débloqués.
            </p>
            <Button
              className="mt-6 w-full bg-gradient-primary shadow-glow hover:opacity-95"
              onClick={() => router.push("/dashboard")}
            >
              Accéder au dashboard
            </Button>
          </>
        )}

        {state === "fail" && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 text-xl font-semibold">Paiement non confirmé</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Le paiement n&apos;a pas pu être validé. Vous pouvez réessayer depuis la page des tarifs.
            </p>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => router.push("/#pricing")}>
                Voir les tarifs
              </Button>
              <Button className="flex-1" onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Chargement…
        </div>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}
