import type { Metadata } from "next";
import { MessagePage } from "@/components/sections/message-page";
import { site } from "@/content";
import { pageMetadata } from "../shared-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: site.privacy.title,
    description: site.privacy.description,
    path: "/privacy/",
  }),
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <main id="main">
      <MessagePage
        heading={site.privacy.title}
        body={site.privacy.body}
        homeLink={site.privacy.homeLink}
      />
    </main>
  );
}
