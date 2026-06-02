"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Mail, Briefcase, Send, Mic, ShieldCheck,
  Sparkles, Plus, LogOut, Menu, X,
} from "lucide-react";
import { toast } from "sonner";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { DashboardView } from "@/components/dashboard/views";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { ResumesSection } from "@/components/dashboard/ResumesSection";
import { LettersSection } from "@/components/dashboard/LettersSection";
import { OffersSection } from "@/components/dashboard/OffersSection";
import { AutoApplySection } from "@/components/dashboard/AutoApplySection";
import { MockInterviewSection } from "@/components/dashboard/MockInterviewSection";
import { AtsCheckerSection } from "@/components/dashboard/AtsCheckerSection";

const NAV: { id: DashboardView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "resumes", label: "Mes CV", icon: FileText },
  { id: "letters", label: "Lettres", icon: Mail },
  { id: "offers", label: "Offres", icon: Briefcase },
  { id: "autoapply", label: "Auto-Apply", icon: Send },
  { id: "interview", label: "Mock Interview", icon: Mic },
  { id: "ats", label: "ATS Checker", icon: ShieldCheck },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, hydrated, plan, setPlan, signOut, resumes, autoApply } = useStore();
  const [view, setView] = useState<DashboardView>("overview");
  const [mobileNav, setMobileNav] = useState(false);

  // Auth guard: redirect to home if not signed in.
  useEffect(() => {
    if (hydrated && !user) router.replace("/");
  }, [hydrated, user, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Chargement...
      </div>
    );
  }
  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const navigate = (v: DashboardView) => {
    setView(v);
    setMobileNav(false);
  };

  const quickAutoApply = () => {
    const n = autoApply(3);
    if (n === 0) toast.error("Plus aucune offre à postuler.");
    else toast.success(`${n} candidature${n > 1 ? "s" : ""} envoyée${n > 1 ? "s" : ""} !`);
  };

  const cvUsed = Math.min(resumes.length, 3);
  const planLimit = plan === "Free";

  const Sidebar = (
    <div className="flex h-full flex-col p-4">
      <nav className="space-y-1">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              view === item.id
                ? "bg-accent font-medium text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-8 rounded-xl border border-border bg-gradient-to-b from-accent/40 to-card p-4">
        <div className="text-sm font-medium">Plan {plan}</div>
        {planLimit ? (
          <>
            <p className="mt-1 text-xs text-muted-foreground">{cvUsed}/3 CV générés ce mois.</p>
            <Progress value={(cvUsed / 3) * 100} className="mt-3" />
            <Button
              size="sm"
              className="mt-3 w-full bg-gradient-primary shadow-glow hover:opacity-95"
              onClick={() => {
                setPlan("Pro");
                toast.success("Bienvenue dans le plan Pro ! 🎉");
              }}
            >
              Passer Pro
            </Button>
          </>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">Générations illimitées débloquées.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileNav((v) => !v)}
            >
              {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold tracking-tight">Hirewise</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => navigate("resumes")}>
              <Plus className="mr-1 h-4 w-4" /> Nouveau CV
            </Button>
            <Button
              size="sm"
              className="bg-gradient-primary shadow-glow hover:opacity-95"
              onClick={quickAutoApply}
            >
              <Send className="mr-1 h-4 w-4" /> Auto-Apply
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Se déconnecter"
              onClick={() => {
                signOut();
                toast.success("Déconnecté.");
                router.push("/");
              }}
            >
              <LogOut className="h-4 w-4" />
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-sm font-medium text-primary-foreground">
              {initials}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border bg-background md:block">
          {Sidebar}
        </aside>

        {/* Mobile sidebar */}
        {mobileNav && (
          <aside className="fixed inset-x-0 top-16 z-30 border-b border-border bg-background md:hidden">
            {Sidebar}
          </aside>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          {view === "overview" && <OverviewSection onNavigate={navigate} />}
          {view === "resumes" && <ResumesSection />}
          {view === "letters" && <LettersSection />}
          {view === "offers" && <OffersSection />}
          {view === "autoapply" && <AutoApplySection />}
          {view === "interview" && <MockInterviewSection />}
          {view === "ats" && <AtsCheckerSection />}
        </main>
      </div>
    </div>
  );
}
