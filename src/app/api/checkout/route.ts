import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PLANS } from "@/lib/plans";
import type { PlanId } from "@/lib/types";

export const runtime = "nodejs";

// Tunnel de paiement réel via Stripe Checkout.
// - Si STRIPE_SECRET_KEY est configurée → vraie session Stripe (mode subscription).
// - Sinon → réponse "demo" pour que l'app reste démontrable sans clés.
export async function POST(request: Request) {
  let body: { plan?: PlanId; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const planId = body.plan;
  if (!planId || !(planId in PLANS) || planId === "Free") {
    return NextResponse.json({ error: "Plan invalide." }, { status: 400 });
  }
  const plan = PLANS[planId];

  const secret = process.env.STRIPE_SECRET_KEY;
  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  // Pas de clé Stripe : on bascule en mode démo (paiement simulé).
  if (!secret) {
    return NextResponse.json({
      mode: "demo",
      url: `${origin}/dashboard/success?plan=${planId}&demo=1`,
    });
  }

  try {
    const stripe = new Stripe(secret);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: body.email,
      line_items: [
        {
          price_data: {
            currency: plan.currency,
            unit_amount: plan.priceAmount,
            recurring: { interval: plan.interval === "year" ? "year" : "month" },
            product_data: {
              name: `Hirewise ${plan.name}`,
              description: plan.desc,
            },
          },
          quantity: 1,
        },
      ],
      metadata: { plan: planId },
      success_url: `${origin}/dashboard/success?plan=${planId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#pricing`,
    });

    return NextResponse.json({ mode: "stripe", url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
