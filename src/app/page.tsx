import { CTA } from "@/presentation/landing/CTA";
import { Features } from "@/presentation/landing/Features";
import { Footer } from "@/presentation/landing/Footer";
import { Header } from "@/presentation/landing/Header";
import { Hero } from "@/presentation/landing/Hero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <div className="pt-16 flex flex-col gap-16 px-6 max-w-7xl mx-auto w-full flex-1">
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
