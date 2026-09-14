import type { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import OurStory from "@/components/about/OurStory";
import WhatWeDo from "@/components/about/WhatWeDo";
import Values from "@/components/about/Values";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Shiwa Krishi Farm's story, our values, and how we raise our poultry, goats, and dairy, and grow our organic vegetables.",
};

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