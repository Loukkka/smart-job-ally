import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Hirewise — Décrochez votre prochain job 10× plus vite avec l'IA",
  description:
    "Hirewise génère des CV optimisés ATS, postule à votre place et vous prépare aux entretiens. La plateforme tout-en-un des chercheurs d'emploi.",
  authors: [{ name: "Hirewise" }],
  openGraph: {
    type: "website",
    title: "Hirewise — Décrochez votre prochain job 10× plus vite",
    description:
      "CV IA, auto-apply, mock interviews et matching d'offres. Tout pour accélérer votre carrière.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
