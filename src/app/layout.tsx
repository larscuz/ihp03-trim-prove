import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IHP03-01 Prøve – Trim AS",
  description: "Fagprøve og kompetansebevis i innholdsproduksjonsfaget (IHP03-01) som kreativ brief.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
