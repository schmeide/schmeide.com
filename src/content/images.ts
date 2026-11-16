import type { ImageSlot } from "@/lib/images/types";

const UNSPLASH_ARCHIVE_LICENSE =
  "CC0 1.0, from the Unsplash archive on Wikimedia Commons";

export const heroImage: ImageSlot = {
  name: "hero",
  alt: "A baker in an apron holds a round loaf of bread in a cloth.",
  aspectRatio: { width: 4, height: 5 },
  placeholder: true,
  source: {
    credit: "Kate Remmer",
    license: UNSPLASH_ARCHIVE_LICENSE,
    url: "https://commons.wikimedia.org/wiki/File:Man_holding_bread_(Unsplash).jpg",
  },
};

export const problemImage: ImageSlot = {
  name: "problem",
  alt: "A leather worker at a bench covered with tools and offcuts.",
  aspectRatio: { width: 4, height: 3 },
  placeholder: true,
  source: {
    credit: "Clem Onojeghuo",
    license: UNSPLASH_ARCHIVE_LICENSE,
    url: "https://commons.wikimedia.org/wiki/File:Leather_trinket_craftsman_(Unsplash).jpg",
  },
};

export const imageSlots: readonly ImageSlot[] = [heroImage, problemImage];
