const steps = [
  { n: "01", t: "Importez votre CV", d: "Uploadez votre CV ou créez-en un depuis zéro. Notre IA analyse votre profil en quelques secondes." },
  { n: "02", t: "Recevez des offres", d: "Le moteur de matching IA vous propose les offres les plus pertinentes, classées par compatibilité." },
  { n: "03", t: "Postulez & décrochez", d: "Auto-apply, lettres personnalisées, préparation aux entretiens. Tout est automatisé." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative border-y border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-medium text-primary">Comment ça marche</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Trois étapes. Zéro friction.
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-8 shadow-card">
              <div className="text-5xl font-semibold tracking-tight text-gradient">{s.n}</div>
              <h3 className="mt-4 text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
