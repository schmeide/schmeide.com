import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { PRODUCT_NAME } from "@/content";

const SRC = join(process.cwd(), "src");

const listFiles = (dir: string): readonly string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? listFiles(join(dir, entry.name))
      : [join(dir, entry.name)],
  );

const toPosix = (path: string): string =>
  relative(SRC, path).split(sep).join("/");

const sources = listFiles(SRC)
  .filter((path) => /\.(ts|tsx|css)$/.test(path))
  .map((path) => ({ path: toPosix(path), text: readFileSync(path, "utf8") }));

const pathsWhere = (
  matches: (source: { path: string; text: string }) => boolean,
): readonly string[] => sources.filter(matches).map((source) => source.path);

describe("repo invariants", () => {
  it("writes the brand name as a literal only inside src/content", () => {
    const brand = new RegExp(PRODUCT_NAME, "i");
    expect(
      pathsWhere(
        ({ path, text }) => !path.startsWith("content/") && brand.test(text),
      ),
    ).toEqual([]);
  });

  it("keeps client components inside src/components/islands", () => {
    const directive = /^\s*["']use client["']/m;
    expect(
      pathsWhere(
        ({ path, text }) =>
          !path.startsWith("components/islands/") && directive.test(text),
      ),
    ).toEqual([]);
  });

  it("uses no server actions", () => {
    const directive = /^\s*["']use server["']/m;
    expect(pathsWhere(({ text }) => directive.test(text))).toEqual([]);
  });

  it("reads process.env only in src/lib/env.ts", () => {
    expect(
      pathsWhere(
        ({ path, text }) =>
          path !== "lib/env.ts" &&
          !path.endsWith(".test.ts") &&
          text.includes("process.env"),
      ),
    ).toEqual([]);
  });

  it("imports the content module only through its entry point", () => {
    const deepImport = /from\s+["']@\/content\/[^"']+["']/;
    expect(
      pathsWhere(
        ({ path, text }) =>
          !path.startsWith("content/") && deepImport.test(text),
      ),
    ).toEqual([]);
  });
});
