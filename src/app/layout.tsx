import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Sport Carlos Manager", description: "Trello + CRM + Licitações" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="pt-BR"><body>{children}</body></html>);
}
