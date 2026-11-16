export type ImageWidth = 640 | 1024 | 1600;

export type ImageFormat = "avif" | "webp";

export type AspectRatio = {
  readonly width: number;
  readonly height: number;
};

export type ImageSource = {
  readonly credit: string;
  readonly license: string;
  readonly url: string | null;
};

export type ImageSlot = {
  readonly name: string;
  readonly alt: string;
  readonly aspectRatio: AspectRatio;
  readonly placeholder: boolean;
  readonly source: ImageSource;
};

export type ImageRadius = "card" | "panel";

export type RoundedImageProps = {
  readonly image: ImageSlot;
  readonly sizes: string;
  readonly radius: ImageRadius;
  readonly priority: boolean;
};

export type ImageFilePath = (
  name: string,
  width: ImageWidth,
  format: ImageFormat,
) => string;
