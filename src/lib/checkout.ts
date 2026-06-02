import type { PlanId } from "./types";

// Démarre le tunnel de paiement : appelle l'API checkout puis redirige
// vers Stripe (clés configurées) ou vers la page succès en mode démo.
export async function startCheckout(plan: PlanId, email?: string): Promise<void> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan, email }),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Le paiement n'a pas pu démarrer.");
  }

  const data = (await res.json()) as { url?: string };
  if (!data.url) throw new Error("URL de paiement manquante.");
  window.location.href = data.url;
}
