import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { JsonLd } from "@/components/ui/json-ld";
import { PRODUCT_NAME, SITE_URL, site } from "@/content";
import { cx } from "@/lib/cx";
import { organizationJsonLd } from "@/lib/structured-data";
import {
  OG_IMAGE_PATH,
  OG_IMAGE_SIZE,
  THEME_COLORS,
  TOUCH_ICON_PATH,
} from "@/lib/theme";
import { displayFont, sansFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: site.meta.title,
    template: `%s | ${PRODUCT_NAME}`,
  },
  description: site.meta.description,
  applicationName: PRODUCT_NAME,
  openGraph: {
    type: "website",
    locale: "en",
    url: "/",
    siteName: PRODUCT_NAME,
    title: site.meta.title,
    description: site.meta.description,
    images: [{ url: OG_IMAGE_PATH, ...OG_IMAGE_SIZE, alt: site.meta.tagline }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.meta.title,
    description: site.meta.description,
    images: [OG_IMAGE_PATH],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: TOUCH_ICON_PATH,
  },
};

export const viewport: Viewport = {
  themeColor: THEME_COLORS.ink,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const year = new Date().getFullYear();
  return (
    <html
      lang="en"
      className={cx(displayFont.variable, sansFont.variable, "antialiased")}
    >
      <body className="flex min-h-dvh flex-col">
        <SkipLink label={site.nav.skipLinkLabel} />
        <SiteHeader name={PRODUCT_NAME} nav={site.nav} />
        <div className="flex-1">{children}</div>
        <SiteFooter content={site.footer} year={year} />
        <JsonLd
          data={organizationJsonLd({
            name: PRODUCT_NAME,
            url: SITE_URL,
            description: site.meta.description,
          })}
        />
      </body>
    </html>
  );
}
