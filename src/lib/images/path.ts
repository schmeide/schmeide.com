import type {
  AspectRatio,
  ImageFilePath,
  ImageFormat,
  ImageWidth,
} from "./types";

export const IMAGE_WIDTHS: readonly ImageWidth[] = [640, 1024, 1600];

export const IMAGE_FORMATS: readonly ImageFormat[] = ["avif", "webp"];

export const IMAGE_DIRECTORY = "/images";

export const imageFilePath: ImageFilePath = (name, width, format) =>
  `${IMAGE_DIRECTORY}/${name}-${width}.${format}`;

export const imageSrcSet = (name: string, format: ImageFormat): string =>
  IMAGE_WIDTHS.map(
    (width) => `${imageFilePath(name, width, format)} ${width}w`,
  ).join(", ");

export const heightFor = (width: number, ratio: AspectRatio): number =>
  Math.round((width * ratio.height) / ratio.width);
