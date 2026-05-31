const stats = [
  { v: "10×", l: "plus rapide à décrocher un entretien" },
  { v: "92/100", l: "score ATS moyen de nos utilisateurs" },
  { v: "47k+", l: "candidatures envoyées chaque mois" },
  { v: "3.2×", l: "plus de réponses recruteurs" },
];

export function Stats() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 rounded-2xl border border-border bg-gradient-to-b from-card to-muted/40 p-10 shadow-card md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-4xl font-semibold tracking-tight text-gradient sm:text-5xl">{s.v}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
