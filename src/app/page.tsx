import { CTA } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

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
