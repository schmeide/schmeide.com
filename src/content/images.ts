import type { ImageSlot } from "@/lib/images/types";

export const heroImage: ImageSlot = {
  name: "hero",
  alt: "",
  aspectRatio: { width: 4, height: 5 },
  placeholder: true,
  source: {
    credit: "to be recorded",
    license: "to be recorded",
    url: null,
  },
};

export const problemImage: ImageSlot = {
  name: "problem",
  alt: "",
  aspectRatio: { width: 4, height: 3 },
  placeholder: true,
  source: {
    credit: "to be recorded",
    license: "to be recorded",
    url: null,
  },
};

export const imageSlots: readonly ImageSlot[] = [heroImage, problemImage];
