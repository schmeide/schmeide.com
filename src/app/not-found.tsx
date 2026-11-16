import type { Metadata } from "next";
import { MessagePage } from "@/components/sections/message-page";
import { site } from "@/content";
import { pageMetadata } from "./shared-metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: site.notFound.heading,
    description: site.notFound.body,
  }),
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
