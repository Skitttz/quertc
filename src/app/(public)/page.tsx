import { About } from "@/components/landing/about";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/layout/footer";
import { PublicContainer } from "@/components/public/PublicContainer";

export default function Home() {
  return (
    <PublicContainer>
      <Hero />
      <Features />
      <About />
      <Footer />
    </PublicContainer>
  );
}
