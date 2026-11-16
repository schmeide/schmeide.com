import { cx } from "@/lib/cx";
import { heightFor, imageFilePath, imageSrcSet } from "@/lib/images/path";
import type { ImageRadius, RoundedImageProps } from "@/lib/images/types";

const INTRINSIC_WIDTH = 1600;

const FALLBACK_WIDTH = 1024;

const radii = {
  card: "rounded-card",
  panel: "rounded-panel",
} as const satisfies Record<ImageRadius, string>;

export const RoundedImage = ({
  image,
  sizes,
  radius,
  priority,
}: RoundedImageProps) => (
  <picture>
    <source
      type="image/avif"
      srcSet={imageSrcSet(image.name, "avif")}
      sizes={sizes}
    />
    <source
      type="image/webp"
      srcSet={imageSrcSet(image.name, "webp")}
      sizes={sizes}
    />
    <img
      src={imageFilePath(image.name, FALLBACK_WIDTH, "webp")}
      alt={image.alt}
      width={INTRINSIC_WIDTH}
      height={heightFor(INTRINSIC_WIDTH, image.aspectRatio)}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "auto" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={cx("h-auto w-full bg-mint object-cover", radii[radius])}
    />
  </picture>
);
