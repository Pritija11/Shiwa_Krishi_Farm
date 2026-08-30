import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import WhatWeDo from "@/components/about/WhatWeDo";
import Values from "@/components/about/Values";
import AboutCTA from "@/components/about/AboutCTA";

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <OurStory />
      <WhatWeDo />
      <Values />
      <AboutCTA />
    </main>
  );
}