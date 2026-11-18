import type { Metadata } from "next";
import { site } from "@/content";
import type { InnerPageContent, LinkContent } from "@/content";
import { LAUNCH_MODE, PLACEHOLDER_MODE } from "@/lib/env";
import { pickForMode } from "@/lib/launch-mode";
import { isListed, isReady } from "@/lib/ready";
import { pageMetadata } from "./shared-metadata";

export const innerPages: readonly InnerPageContent[] = [
  site.earlyAccessPage,
  ...site.useCases,
];

export const listedPages = innerPages.filter((page) =>
  isListed(page, PLACEHOLDER_MODE),
);

export const pageLinks: readonly LinkContent[] = listedPages.map(
  ({ navLabel, href }) => ({ label: navLabel, href }),
);

export const mainCta = pickForMode<LinkContent>(site.mainCta, LAUNCH_MODE);

export const innerPageMetadata = (page: InnerPageContent): Metadata => ({
  ...pageMetadata({
    title: page.title,
    description: page.description,
    path: page.href,
  }),
  ...(isReady(page) ? {} : { robots: { index: false, follow: true } }),
});
