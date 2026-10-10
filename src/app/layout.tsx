import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ptBR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import { connectToDatabase } from "@/config/database";
import ThemeProvider from "@/providers/theme";
import { AppRoutesEnum } from "@/shared/route";

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
    <ClerkProvider
      localization={ptBR}
      appearance={{ baseTheme: shadcn }}
      signInUrl={AppRoutesEnum.SIGN_IN}
      signUpUrl={AppRoutesEnum.SIGN_UP}
      signInFallbackRedirectUrl={AppRoutesEnum.CHAT}
      signUpFallbackRedirectUrl={AppRoutesEnum.CHAT}
    >
      <html lang="pt-BR" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
