import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// Vérifie qu'une session Stripe a bien été payée avant d'activer le plan côté client.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  const demo = searchParams.get("demo");

  // Mode démo : pas de vérification Stripe nécessaire.
  if (demo === "1" || !sessionId) {
    return NextResponse.json({ paid: demo === "1", mode: "demo" });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ paid: false, mode: "demo" });
  }

  try {
    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      paid: session.payment_status === "paid",
      mode: "stripe",
      plan: session.metadata?.plan ?? null,
    });
  } catch {
    return NextResponse.json({ paid: false, mode: "stripe" }, { status: 500 });
  }
}
