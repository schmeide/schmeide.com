import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { PLACEHOLDER_LABEL, imageSlots, site } from "@/content";
import { IMAGE_FORMATS, IMAGE_WIDTHS, imageFilePath } from "@/lib/images/path";
import { isPlaceholder } from "@/lib/placeholder";
import type { Copy } from "@/lib/placeholder";

const collectCopy = (value: unknown): readonly Copy[] => {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap(collectCopy);
  }
  if (typeof value !== "object" || value === null) {
    return [];
  }
  if ("kind" in value && value.kind === "placeholder") {
    return [value as Copy];
  }
  return Object.values(value).flatMap(collectCopy);
};

const allCopy = collectCopy(site);

const allText = allCopy.map((copy) =>
  isPlaceholder(copy) ? (copy.fallback ?? "") : copy,
);

describe("site content", () => {
  it("gives every placeholder a note", () => {
    expect(
      allCopy.filter(isPlaceholder).filter((copy) => copy.note.trim() === ""),
    ).toEqual([]);
  });

  it("labels every placeholder note", () => {
    expect(
      allCopy
        .filter(isPlaceholder)
        .filter((copy) => !copy.note.startsWith(`${PLACEHOLDER_LABEL}: `)),
    ).toEqual([]);
  });

  it("never claims to be the only one", () => {
    const banned = /nobody else|no one else|the only (one|company|service)/i;
    expect(allText.filter((text) => banned.test(text))).toEqual([]);
  });

  it("contains no bracketed placeholder text", () => {
    expect(allText.filter((text) => /\[.*placeholder.*\]/i.test(text))).toEqual(
      [],
    );
  });

  it("has a question for every FAQ item", () => {
    expect(
      site.faq.items.filter((item) => item.question.trim() === ""),
    ).toEqual([]);
  });

  it("numbers the pipeline with exactly one approval gate", () => {
    expect(
      site.howItWorks.steps.filter((step) => step.isApprovalGate),
    ).toHaveLength(1);
  });

  it("assigns every pipeline step to a known phase", () => {
    const phases = site.howItWorks.phases.map((phase) => phase.id);
    expect(
      site.howItWorks.steps.filter((step) => !phases.includes(step.phase)),
    ).toEqual([]);
  });

  it("maps every waitlist field to a label", () => {
    expect(Object.keys(site.waitlistForm.fields).sort()).toEqual([
      "business",
      "email",
      "name",
    ]);
  });
});

describe("image slots", () => {
  it("have every derivative file in public/images", () => {
    const missing = imageSlots.flatMap((slot) =>
      IMAGE_WIDTHS.flatMap((width) =>
        IMAGE_FORMATS.map((format) => imageFilePath(slot.name, width, format)),
      ).filter((path) => !existsSync(join(process.cwd(), "public", path))),
    );
    expect(missing).toEqual([]);
  });

  it("record a credit and a license", () => {
    expect(
      imageSlots.filter(
        (slot) => slot.source.credit === "" || slot.source.license === "",
      ),
    ).toEqual([]);
  });
});

const listFiles = (dir: string): readonly string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? listFiles(join(dir, entry.name))
      : [join(dir, entry.name)],
  );

const proseConstant =
  /^\s*(?:export\s+)?const\s+\w+\s*(?::[^=]+)?=\s*(["'`])[A-Z][a-z]+\b[^"'`]*\1/m;

describe("copy outside src/content", () => {
  it("is not kept in string constants in src/lib or src/components", () => {
    const src = join(process.cwd(), "src");
    const offenders = ["lib", "components"]
      .flatMap((dir) => listFiles(join(src, dir)))
      .filter((path) => /\.tsx?$/.test(path) && !/\.test\.tsx?$/.test(path))
      .filter((path) => proseConstant.test(readFileSync(path, "utf8")))
      .map((path) => relative(src, path));
    expect(offenders).toEqual([]);
  });

  it("flags a prose constant and ignores ids and paths", () => {
    expect(proseConstant.test('export const LABEL = "Placeholder";')).toBe(
      true,
    );
    expect(proseConstant.test('const HEADING_ID = "faq-heading";')).toBe(false);
    expect(proseConstant.test('export const OG_IMAGE_PATH = "/og.png";')).toBe(
      false,
    );
  });
});
