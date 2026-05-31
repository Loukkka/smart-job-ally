import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-accent/30 to-card p-12 text-center shadow-elevated sm:p-16">
          <div className="absolute inset-0 bg-hero-gradient opacity-60" />
          <div className="relative">
            <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Prêt à décrocher votre prochain job ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Rejoignez des milliers de chercheurs d'emploi qui ont accéléré leur carrière avec Hirewise.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="h-12 bg-gradient-primary px-6 text-base shadow-glow hover:opacity-95" asChild>
                <Link href="/dashboard">
                  Commencer gratuitement
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6 text-base">
                Parler à un expert
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
