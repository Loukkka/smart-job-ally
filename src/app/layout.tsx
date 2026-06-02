import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

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
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
