import type { Metadata } from "next";
import { PRODUCT_NAME, site } from "@/content";
import { OG_IMAGE_PATH, OG_IMAGE_SIZE } from "@/lib/theme";

export type SocialMetadataInput = {
  readonly title: NonNullable<Metadata["title"]>;
  readonly description: string;
  readonly path?: string;
};

export type PageMetadataInput = SocialMetadataInput & {
  readonly title: string;
};

export const titleTemplate = `%s | ${PRODUCT_NAME}`;

const sharedOpenGraph = {
  type: "website",
  locale: "en",
  siteName: PRODUCT_NAME,
  images: [{ url: OG_IMAGE_PATH, ...OG_IMAGE_SIZE, alt: site.meta.tagline }],
} as const satisfies Metadata["openGraph"];

const sharedTwitter = {
  card: "summary_large_image",
  images: [OG_IMAGE_PATH],
} as const satisfies Metadata["twitter"];

export const socialMetadata = ({
  title,
  description,
  path,
}: SocialMetadataInput): Pick<Metadata, "openGraph" | "twitter"> => ({
  openGraph: {
    ...sharedOpenGraph,
    ...(path === undefined ? {} : { url: path }),
    title,
    description,
  },
  twitter: { ...sharedTwitter, title, description },
});

export const pageMetadata = (input: PageMetadataInput): Metadata => ({
  title: input.title,
  description: input.description,
  ...(input.path === undefined
    ? {}
    : { alternates: { canonical: input.path } }),
  ...socialMetadata(input),
});
