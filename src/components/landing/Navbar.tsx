"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/AuthDialog";

export function Navbar() {
  const { user, hydrated } = useStore();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  const openAuth = (t: "signin" | "signup") => {
    setTab(t);
    setAuthOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-base font-semibold tracking-tight">Hirewise</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Fonctionnalités</a>
          <a href="#how" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Comment ça marche</a>
          <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Tarifs</a>
          <a href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">FAQ</a>
        </nav>

        <div className="flex items-center gap-2">
          {hydrated && user ? (
            <Button
              size="sm"
              className="bg-gradient-primary shadow-glow hover:opacity-95"
              onClick={() => router.push("/dashboard")}
            >
              Mon dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => openAuth("signin")}>
                Connexion
              </Button>
              <Button
                size="sm"
                className="bg-gradient-primary shadow-glow hover:opacity-95"
                onClick={() => openAuth("signup")}
              >
                Commencer gratuitement
              </Button>
            </>
          )}
        </div>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={tab} />
    </header>
  );
}
