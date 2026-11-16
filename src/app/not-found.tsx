import type { Metadata } from "next";
import { MessagePage } from "@/components/sections/message-page";
import { site } from "@/content";

export const metadata: Metadata = {
  title: site.notFound.heading,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main id="main">
      <MessagePage
        heading={site.notFound.heading}
        body={site.notFound.body}
        homeLink={site.notFound.homeLink}
      />
    </main>
  );
}
