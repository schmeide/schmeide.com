import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { JsonLd } from "@/components/ui/json-ld";
import { PRODUCT_NAME, SITE_URL, site } from "@/content";
import { cx } from "@/lib/cx";
import { organizationJsonLd } from "@/lib/structured-data";
import { THEME_COLORS, TOUCH_ICON_PATH } from "@/lib/theme";
import { displayFont, sansFont } from "./fonts";
import { mainCta, pageLinks } from "./pages";
import { socialMetadata, titleTemplate } from "./shared-metadata";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: site.meta.title,
    template: titleTemplate,
  },
  description: site.meta.description,
  applicationName: PRODUCT_NAME,
  ...socialMetadata({
    title: { default: site.meta.title, template: titleTemplate },
    description: site.meta.description,
  }),
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
        <SiteHeader name={PRODUCT_NAME} nav={site.nav} cta={mainCta} />
        <div className="flex-1">{children}</div>
        <SiteFooter content={site.footer} pageLinks={pageLinks} year={year} />
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
