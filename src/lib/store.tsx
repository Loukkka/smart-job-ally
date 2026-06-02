"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AppData,
  Application,
  ApplicationStatus,
  CoverLetter,
  JobOffer,
  PlanId,
  Resume,
  Subscription,
  User,
} from "./types";
import { OFFERS } from "./offers";
import { PLANS } from "./plans";

const STORAGE_KEY = "hirewise:data:v2";

const EMPTY: AppData = {
  user: null,
  plan: "Free",
  subscription: { status: "none", since: null, provider: null },
  resumes: [],
  letters: [],
  applications: [],
};

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

function load(): AppData {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as AppData) };
  } catch {
    return EMPTY;
  }
}

interface StoreValue extends AppData {
  hydrated: boolean;
  isPro: boolean;
  // auth
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  // plan / abonnement
  activatePlan: (plan: PlanId, provider?: Subscription["provider"]) => void;
  cancelSubscription: () => void;
  canCreateResume: () => boolean;
  canCreateLetter: () => boolean;
  autoApplyLimit: () => number;
  // resumes
  addResume: (input: { title: string; role: string; summary: string; skills: string }) => Resume | null;
  removeResume: (id: string) => void;
  // letters
  addLetter: (input: { company: string; role: string; tone: CoverLetter["tone"] }) => CoverLetter | null;
  removeLetter: (id: string) => void;
  // applications
  apply: (offer: JobOffer) => boolean;
  setApplicationStatus: (id: string, status: ApplicationStatus) => void;
  autoApply: (offers: JobOffer[], count: number) => number;
  hasApplied: (offerId: string) => boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

function generateSummary(role: string, skills: string[]): string {
  const top = skills.slice(0, 3).join(", ") || "vos compétences clés";
  return `Professionnel orienté ${role}, je combine ${top} pour livrer un impact mesurable. Reconnu pour ma rigueur, ma collaboration et ma capacité à transformer des objectifs ambitieux en résultats concrets.`;
}

function computeAtsScore(skills: string[], summaryLen: number): number {
  let score = 60;
  score += Math.min(skills.length * 5, 25);
  score += summaryLen > 80 ? 10 : 4;
  return Math.min(score, 99);
}

function generateLetter(company: string, role: string, tone: CoverLetter["tone"]): string {
  const intros: Record<CoverLetter["tone"], string> = {
    Formel: `Madame, Monsieur,\n\nC'est avec un vif intérêt que je vous adresse ma candidature pour le poste de ${role} au sein de ${company}.`,
    Créatif: `Bonjour l'équipe ${company} 👋\n\nQuand j'ai vu votre offre de ${role}, j'ai tout de suite su que je voulais en faire partie.`,
    Technique: `Bonjour,\n\nJe candidate au poste de ${role} chez ${company}. Mon expertise technique correspond précisément à vos besoins.`,
  };
  return `${intros[tone]}\n\nMon parcours m'a permis de développer une solide expérience directement applicable à vos enjeux. Je suis convaincu(e) de pouvoir contribuer rapidement aux objectifs de ${company} et d'apporter une réelle valeur à votre équipe.\n\nJe serais ravi(e) d'échanger sur la façon dont je peux vous aider à réussir.\n\nCordialement.`;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore quota errors */
    }
  }, [data, hydrated]);

  const signIn = useCallback((email: string, name?: string) => {
    const user: User = {
      email,
      name: name?.trim() || email.split("@")[0].replace(/[._]/g, " ") || "Utilisateur",
    };
    setData((d) => ({ ...d, user }));
  }, []);

  const signOut = useCallback(() => {
    setData((d) => ({ ...d, user: null }));
  }, []);

  const activatePlan = useCallback<StoreValue["activatePlan"]>((plan, provider = "demo") => {
    setData((d) => ({
      ...d,
      plan,
      subscription:
        plan === "Free"
          ? { status: "none", since: null, provider: null }
          : { status: "active", since: new Date().toISOString(), provider },
    }));
  }, []);

  const cancelSubscription = useCallback(() => {
    setData((d) => ({
      ...d,
      plan: "Free",
      subscription: { status: "none", since: null, provider: null },
    }));
  }, []);

  const canCreateResume = useCallback(() => {
    const limit = PLANS[data.plan].limits.resumes;
    return limit === -1 || data.resumes.length < limit;
  }, [data.plan, data.resumes.length]);

  const canCreateLetter = useCallback(() => {
    const limit = PLANS[data.plan].limits.letters;
    return limit === -1 || data.letters.length < limit;
  }, [data.plan, data.letters.length]);

  const autoApplyLimit = useCallback(
    () => PLANS[data.plan].limits.autoApplyPerRun,
    [data.plan]
  );

  const addResume = useCallback<StoreValue["addResume"]>(
    (input) => {
      const limit = PLANS[data.plan].limits.resumes;
      if (limit !== -1 && data.resumes.length >= limit) return null;

      const skills = input.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const summary = input.summary.trim() || generateSummary(input.role, skills);
      const resume: Resume = {
        id: uid("cv"),
        title: input.title.trim() || `CV ${input.role}`,
        role: input.role.trim(),
        summary,
        skills,
        atsScore: computeAtsScore(skills, summary.length),
        createdAt: new Date().toISOString(),
      };
      setData((d) => ({ ...d, resumes: [resume, ...d.resumes] }));
      return resume;
    },
    [data.plan, data.resumes.length]
  );

  const removeResume = useCallback((id: string) => {
    setData((d) => ({ ...d, resumes: d.resumes.filter((r) => r.id !== id) }));
  }, []);

  const addLetter = useCallback<StoreValue["addLetter"]>(
    (input) => {
      const limit = PLANS[data.plan].limits.letters;
      if (limit !== -1 && data.letters.length >= limit) return null;

      const letter: CoverLetter = {
        id: uid("lt"),
        company: input.company.trim(),
        role: input.role.trim(),
        tone: input.tone,
        content: generateLetter(input.company.trim(), input.role.trim(), input.tone),
        createdAt: new Date().toISOString(),
      };
      setData((d) => ({ ...d, letters: [letter, ...d.letters] }));
      return letter;
    },
    [data.plan, data.letters.length]
  );

  const removeLetter = useCallback((id: string) => {
    setData((d) => ({ ...d, letters: d.letters.filter((l) => l.id !== id) }));
  }, []);

  const apply = useCallback<StoreValue["apply"]>((offer) => {
    let added = false;
    setData((d) => {
      if (d.applications.some((a) => a.offerId === offer.id)) return d;
      added = true;
      const application: Application = {
        id: uid("app"),
        offerId: offer.id,
        role: offer.title,
        company: offer.company,
        status: "Envoyé",
        match: offer.match,
        date: new Date().toISOString(),
      };
      return { ...d, applications: [application, ...d.applications] };
    });
    return added;
  }, []);

  const setApplicationStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      setData((d) => ({
        ...d,
        applications: d.applications.map((a) => (a.id === id ? { ...a, status } : a)),
      }));
    },
    []
  );

  const autoApply = useCallback<StoreValue["autoApply"]>((offers, count) => {
    let n = 0;
    const pool = offers.length ? offers : OFFERS;
    setData((d) => {
      const appliedIds = new Set(d.applications.map((a) => a.offerId));
      const candidates = pool
        .filter((o) => !appliedIds.has(o.id))
        .sort((a, b) => b.match - a.match)
        .slice(0, count);
      n = candidates.length;
      const newApps: Application[] = candidates.map((offer) => ({
        id: uid("app"),
        offerId: offer.id,
        role: offer.title,
        company: offer.company,
        status: "Envoyé",
        match: offer.match,
        date: new Date().toISOString(),
      }));
      return { ...d, applications: [...newApps, ...d.applications] };
    });
    return n;
  }, []);

  const hasApplied = useCallback(
    (offerId: string) => data.applications.some((a) => a.offerId === offerId),
    [data.applications]
  );

  const value = useMemo<StoreValue>(
    () => ({
      ...data,
      hydrated,
      isPro: data.plan !== "Free" && data.subscription.status === "active",
      signIn,
      signOut,
      activatePlan,
      cancelSubscription,
      canCreateResume,
      canCreateLetter,
      autoApplyLimit,
      addResume,
      removeResume,
      addLetter,
      removeLetter,
      apply,
      setApplicationStatus,
      autoApply,
      hasApplied,
    }),
    [
      data,
      hydrated,
      signIn,
      signOut,
      activatePlan,
      cancelSubscription,
      canCreateResume,
      canCreateLetter,
      autoApplyLimit,
      addResume,
      removeResume,
      addLetter,
      removeLetter,
      apply,
      setApplicationStatus,
      autoApply,
      hasApplied,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}
