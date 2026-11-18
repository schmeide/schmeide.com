import type { Metadata } from "next";
import { WaitlistForm } from "@/components/islands/waitlist-form";
import { PageIntro } from "@/components/layout/page-intro";
import { EarlyAccess } from "@/components/sections/early-access";
import { site } from "@/content";
import { innerPageMetadata } from "../pages";

const page = site.earlyAccessPage;

export const metadata: Metadata = innerPageMetadata(page);

export default function EarlyAccessPage() {
  return (
    <main id="main">
      <PageIntro heading={page.title} lead={page.lead} />
      <EarlyAccess content={site.earlyAccess}>
        <WaitlistForm content={site.waitlistForm} />
      </EarlyAccess>
    </main>
  );
}
