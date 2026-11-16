import type { Metadata } from "next";
import { WaitlistForm } from "@/components/islands/waitlist-form";
import { EarlyAccess } from "@/components/sections/early-access";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Problem } from "@/components/sections/problem";
import { Proof } from "@/components/sections/proof";
import { Team } from "@/components/sections/team";
import { WhatYouGet } from "@/components/sections/what-you-get";
import { WhyDifferent } from "@/components/sections/why-different";
import { JsonLd } from "@/components/ui/json-ld";
import { site } from "@/content";
import { isConfirmed } from "@/lib/placeholder";
import { faqPageJsonLd } from "@/lib/structured-data";
import { socialMetadata } from "./shared-metadata";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  ...socialMetadata({
    title: site.meta.title,
    description: site.meta.description,
    path: "/",
  }),
};

const confirmedAnswers = site.faq.items.flatMap(({ question, answer }) =>
  isConfirmed(answer) ? [{ question, answer }] : [],
);

export default function HomePage() {
  return (
    <main id="main">
      <Hero content={site.hero} />
      <Problem content={site.problem} />
      <HowItWorks content={site.howItWorks} />
      <WhatYouGet content={site.whatYouGet} />
      <WhyDifferent content={site.whyDifferent} />
      <Proof content={site.proof} />
      <Team content={site.team} />
      <EarlyAccess content={site.earlyAccess}>
        <WaitlistForm content={site.waitlistForm} />
      </EarlyAccess>
      <Faq content={site.faq} />
      <FinalCta content={site.finalCta} />
      {confirmedAnswers.length === 0 ? null : (
        <JsonLd data={faqPageJsonLd(confirmedAnswers)} />
      )}
    </main>
  );
}
