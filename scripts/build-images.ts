import { readdirSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join, parse } from "node:path";
import sharp from "sharp";
import { imageSlots } from "../src/content/images.ts";
import {
  IMAGE_FORMATS,
  IMAGE_WIDTHS,
  heightFor,
  imageFilePath,
} from "../src/lib/images/path.ts";
import type { ImageFormat, ImageSlot } from "../src/lib/images/types.ts";

const SOURCE_DIRECTORY = join(process.cwd(), "assets", "images");

const PUBLIC_DIRECTORY = join(process.cwd(), "public");

const QUALITY = { avif: 50, webp: 72 } as const satisfies Record<
  ImageFormat,
  number
>;

const sourceFor = (name: string): string => {
  const file = readdirSync(SOURCE_DIRECTORY).find(
    (entry) => parse(entry).name === name,
  );
  if (file === undefined) {
    throw new Error(`No source photo for the "${name}" slot`);
  }
  return join(SOURCE_DIRECTORY, file);
};

const writeDerivatives = (slot: ImageSlot): readonly Promise<string>[] =>
  IMAGE_WIDTHS.flatMap((width) =>
    IMAGE_FORMATS.map(async (format) => {
      const target = join(
        PUBLIC_DIRECTORY,
        imageFilePath(slot.name, width, format),
      );
      await sharp(sourceFor(slot.name))
        .resize(width, heightFor(width, slot.aspectRatio), {
          fit: "cover",
          position: "centre",
        })
        .toFormat(format, { quality: QUALITY[format] })
        .toFile(target);
      return target;
    }),
  );

await mkdir(join(PUBLIC_DIRECTORY, "images"), { recursive: true });
const written = await Promise.all(imageSlots.flatMap(writeDerivatives));
console.log(`Wrote ${written.length} files to public/images`);
