"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/AuthDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CTA() {
  const [authOpen, setAuthOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const submitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactOpen(false);
    toast.success("Message envoyé ! Un expert vous recontactera sous 24h.");
  };

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
              Rejoignez des milliers de chercheurs d&apos;emploi qui ont accéléré leur carrière avec Hirewise.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 bg-gradient-primary px-6 text-base shadow-glow hover:opacity-95"
                onClick={() => setAuthOpen(true)}
              >
                Commencer gratuitement
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 text-base"
                onClick={() => setContactOpen(true)}
              >
                Parler à un expert
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="signup" />

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Parler à un expert</DialogTitle>
            <DialogDescription>
              Laissez-nous vos coordonnées, nous vous rappelons sous 24h.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitContact} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ct-name">Nom</Label>
              <Input id="ct-name" required placeholder="Votre nom" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-email">Email</Label>
              <Input id="ct-email" type="email" required placeholder="vous@exemple.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ct-msg">Votre besoin</Label>
              <Textarea id="ct-msg" placeholder="Parlez-nous de votre recherche..." />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary shadow-glow hover:opacity-95">
              Envoyer
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
