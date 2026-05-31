import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Comment fonctionne l'Auto-Apply ?", a: "Sélectionnez les offres qui vous intéressent. Notre moteur remplit automatiquement les formulaires, génère un CV et une lettre adaptés à chaque poste, et soumet la candidature pour vous." },
  { q: "Mes données sont-elles sécurisées ?", a: "Oui. Vos données sont chiffrées en transit et au repos. Nous ne les vendons jamais et vous pouvez les supprimer à tout moment." },
  { q: "Le score ATS est-il fiable ?", a: "Notre algorithme reproduit les principaux systèmes ATS utilisés par les recruteurs (Workday, Greenhouse, Lever, etc.) pour vous donner une note réaliste." },
  { q: "Puis-je annuler mon abonnement ?", a: "À tout moment, en un clic depuis votre dashboard. Aucun engagement, aucun frais caché." },
  { q: "Quelles langues sont supportées ?", a: "Français, anglais, espagnol, allemand, italien et portugais. D'autres langues arrivent bientôt." },
];

export function FAQ() {
  return (
    <section id="faq" className="relative border-t border-border py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <div className="text-sm font-medium text-primary">FAQ</div>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Questions fréquentes
          </h2>
        </div>
        <Accordion type="single" collapsible className="mt-12 w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
