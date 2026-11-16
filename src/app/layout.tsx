import type { Metadata } from "next";
import { PRODUCT_NAME } from "@/content";
import { cx } from "@/lib/cx";
import { displayFont, sansFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: PRODUCT_NAME,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cx(displayFont.variable, sansFont.variable, "antialiased")}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
