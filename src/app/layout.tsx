import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ptBR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { connectToDatabase } from "@/config/database";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quertc | Chat em Tempo Real",
  description:
    "O Quertc Chat é uma plataforma moderna de mensagens em tempo real. Converse com amigos, colegas e equipes com praticidade.",
};

connectToDatabase();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}>
      <html lang="pt-BR">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}