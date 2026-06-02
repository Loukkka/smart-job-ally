import { FileText, Sparkles, Target, Send, Mic, ShieldCheck, LayoutDashboard, Mail } from "lucide-react";

const features = [
  { icon: LayoutDashboard, title: "Dashboard intelligent", desc: "Vue 360° de vos candidatures, statuts en temps réel et statistiques de performance." },
  { icon: FileText, title: "Générateur de CV IA", desc: "Créez des CV optimisés ATS adaptés à chaque offre. Export PDF instantané." },
  { icon: Mail, title: "Lettres personnalisées", desc: "Lettres de motivation générées au ton de votre choix : formel, créatif, technique." },
  { icon: Target, title: "Matching d'offres", desc: "Recommandations type Netflix. Les meilleures offres pour votre profil, classées par pertinence." },
  { icon: Send, title: "Auto-Apply Engine", desc: "Postulez à 50+ offres en un clic. CV et lettres adaptés automatiquement à chaque poste." },
  { icon: Mic, title: "Mock Interview IA", desc: "Entraînez-vous en vocal ou texte. Feedback détaillé sur clarté, pertinence et amélioration." },
  { icon: ShieldCheck, title: "ATS Checker", desc: "Analyse instantanée. Détection des erreurs, score sur 100 et suggestions concrètes." },
  { icon: Sparkles, title: "AI Career Coach", desc: "Un coach IA disponible 24/7 pour répondre à toutes vos questions de carrière." },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-medium text-primary">Tout-en-un</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Tout ce qu&apos;il vous faut pour <span className="text-gradient">être recruté</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Une suite complète d&apos;outils IA pensée pour transformer votre recherche d&apos;emploi.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
