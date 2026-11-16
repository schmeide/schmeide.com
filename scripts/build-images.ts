import { readdirSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join, parse } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { imageSlots } from "../src/content/images.ts";
import {
  IMAGE_FORMATS,
  IMAGE_WIDTHS,
  heightFor,
  imageFilePath,
} from "../src/lib/images/path.ts";
import type {
  AspectRatio,
  ImageFormat,
  ImageSlot,
  ImageWidth,
} from "../src/lib/images/types.ts";

export type DerivativeJob = {
  readonly name: string;
  readonly width: ImageWidth;
  readonly format: ImageFormat;
  readonly aspectRatio: AspectRatio;
};

export type ResizeOptions = {
  readonly width: number;
  readonly height: number;
  readonly fit: "cover";
  readonly position: "centre";
};

export const QUALITY = { avif: 50, webp: 72 } as const satisfies Record<
  ImageFormat,
  number
>;

export const findSourceFile = (
  entries: readonly string[],
  name: string,
): string | undefined => entries.find((entry) => parse(entry).name === name);

export const resolveSourcePath = (
  directory: string,
  entries: readonly string[],
  name: string,
): string => {
  const file = findSourceFile(entries, name);
  if (file === undefined) {
    throw new Error(`No source photo for the "${name}" slot`);
  }
  return join(directory, file);
};

export const targetPath = (
  publicDirectory: string,
  name: string,
  width: ImageWidth,
  format: ImageFormat,
): string => join(publicDirectory, imageFilePath(name, width, format));

export const resizeOptionsFor = (
  width: number,
  aspectRatio: AspectRatio,
): ResizeOptions => ({
  width,
  height: heightFor(width, aspectRatio),
  fit: "cover",
  position: "centre",
});

export const jobsForSlot = (slot: ImageSlot): readonly DerivativeJob[] =>
  IMAGE_WIDTHS.flatMap((width) =>
    IMAGE_FORMATS.map((format) => ({
      name: slot.name,
      width,
      format,
      aspectRatio: slot.aspectRatio,
    })),
  );

export const jobsForSlots = (
  slots: readonly ImageSlot[],
): readonly DerivativeJob[] => slots.flatMap(jobsForSlot);

export const summaryMessage = (count: number): string =>
  `Wrote ${count} files to public/images`;

const SOURCE_DIRECTORY = join(process.cwd(), "assets", "images");

const PUBLIC_DIRECTORY = join(process.cwd(), "public");

const writeDerivative = async (job: DerivativeJob): Promise<string> => {
  const target = targetPath(PUBLIC_DIRECTORY, job.name, job.width, job.format);
  const source = resolveSourcePath(
    SOURCE_DIRECTORY,
    readdirSync(SOURCE_DIRECTORY),
    job.name,
  );
  await sharp(source)
    .resize(resizeOptionsFor(job.width, job.aspectRatio))
    .toFormat(job.format, { quality: QUALITY[job.format] })
    .toFile(target);
  return target;
};

const main = async (): Promise<void> => {
  await mkdir(join(PUBLIC_DIRECTORY, "images"), { recursive: true });
  const written = await Promise.all(
    jobsForSlots(imageSlots).map(writeDerivative),
  );
  console.log(summaryMessage(written.length));
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  await main();
}
