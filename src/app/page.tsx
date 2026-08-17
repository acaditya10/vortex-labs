import { ContactProvider } from "@/components/ui/ContactContext";
import { ContactOverlay } from "@/components/ui/ContactOverlay";
import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/hero/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Capabilities } from "@/components/sections/Capabilities";
import { Philosophy } from "@/components/sections/Philosophy";
import { Process } from "@/components/sections/Process";
import { WhyVortex } from "@/components/sections/WhyVortex";
import { Trust } from "@/components/sections/Trust";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <ContactProvider>
      <Navbar />
      <ContactOverlay />
      <main>
        <Hero />
        <SelectedWork />
        <Capabilities />
        <Philosophy />
        <Process />
        <WhyVortex />
        <Trust />
        <FinalCta />
        <Footer />
      </main>
    </ContactProvider>
  );
}
