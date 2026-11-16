import type { Metadata } from "next";
import { MessagePage } from "@/components/sections/message-page";
import { site } from "@/content";
import { pageMetadata } from "../shared-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: site.terms.title,
    description: site.terms.description,
    path: "/terms/",
  }),
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <main id="main">
      <MessagePage
        heading={site.terms.title}
        body={site.terms.body}
        homeLink={site.terms.homeLink}
      />
    </main>
  );
}
