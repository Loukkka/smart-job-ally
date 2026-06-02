import type { JobOffer } from "./types";

// Catalogue d'offres (mock). Sert au matching et à l'Auto-Apply.
export const OFFERS: JobOffer[] = [
  {
    id: "off-1",
    title: "Senior Product Designer",
    company: "Linear",
    location: "Remote",
    salary: "€70-90k",
    match: 98,
    tags: ["Figma", "Design System", "Produit"],
    description:
      "Rejoignez Linear pour concevoir des expériences ultra-rapides. Vous piloterez le design system et collaborerez étroitement avec l'ingénierie.",
  },
  {
    id: "off-2",
    title: "Full-Stack Engineer",
    company: "Vercel",
    location: "Remote",
    salary: "€80-110k",
    match: 94,
    tags: ["Next.js", "TypeScript", "React"],
    description:
      "Construisez la plateforme qui propulse le web moderne. Stack Next.js / TypeScript, forte culture DX.",
  },
  {
    id: "off-3",
    title: "UX Lead",
    company: "Notion",
    location: "Remote EU",
    salary: "€85-115k",
    match: 91,
    tags: ["UX", "Recherche", "Management"],
    description:
      "Dirigez la vision UX de Notion. Vous encadrez une équipe et définissez les standards de recherche utilisateur.",
  },
  {
    id: "off-4",
    title: "Product Manager",
    company: "Stripe",
    location: "Paris",
    salary: "€90-120k",
    match: 88,
    tags: ["Produit", "Paiements", "Stratégie"],
    description:
      "Pilotez des produits de paiement utilisés par des millions d'entreprises. Vision stratégique et exécution rigoureuse.",
  },
  {
    id: "off-5",
    title: "Frontend Engineer",
    company: "Figma",
    location: "Remote",
    salary: "€75-100k",
    match: 85,
    tags: ["React", "WebGL", "Performance"],
    description:
      "Repoussez les limites du rendu dans le navigateur. Vous travaillerez sur l'éditeur temps réel de Figma.",
  },
  {
    id: "off-6",
    title: "Staff Designer",
    company: "Arc Browser",
    location: "Remote",
    salary: "€95-120k",
    match: 96,
    tags: ["Design", "Branding", "Motion"],
    description:
      "Façonnez l'identité visuelle du navigateur le plus aimé. Liberté créative totale, équipe senior.",
  },
  {
    id: "off-7",
    title: "Senior Engineer",
    company: "Raycast",
    location: "Remote EU",
    salary: "€85-110k",
    match: 93,
    tags: ["Swift", "TypeScript", "Productivité"],
    description:
      "Construisez l'outil de productivité préféré des développeurs. Code natif et extensions.",
  },
  {
    id: "off-8",
    title: "Head of Design",
    company: "Cron",
    location: "New York",
    salary: "€110-140k",
    match: 90,
    tags: ["Leadership", "Calendrier", "Design"],
    description:
      "Dirigez le design d'un calendrier nouvelle génération. Rôle clé, fort impact produit.",
  },
];
