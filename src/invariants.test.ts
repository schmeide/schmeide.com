import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { PRODUCT_NAME } from "@/content";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");

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

const repoSources = ["src", "e2e", "scripts"]
  .flatMap((dir) => listFiles(join(ROOT, dir)))
  .filter((path) => /\.(ts|tsx|mts|cts|js|mjs|cjs|css)$/.test(path))
  .map((path) => ({
    path: relative(ROOT, path).split(sep).join("/"),
    text: readFileSync(path, "utf8"),
  }));

const isScript = (path: string): boolean => !path.endsWith(".css");

const parse = (path: string, text: string): ts.SourceFile =>
  ts.createSourceFile(
    path,
    text,
    ts.ScriptTarget.Latest,
    true,
    path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

const descendants = (node: ts.Node): readonly ts.Node[] =>
  node.getChildren().flatMap((child) => [child, ...descendants(child)]);

const scriptComments = (path: string, text: string): readonly string[] =>
  descendants(parse(path, text)).flatMap((node) =>
    [
      ...(ts.getLeadingCommentRanges(text, node.getFullStart()) ?? []),
      ...(ts.getTrailingCommentRanges(text, node.getEnd()) ?? []),
    ].map((range) => text.slice(range.pos, range.end)),
  );

const cssComments = (text: string): readonly string[] =>
  text
    .replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, "")
    .match(/\/\*[\s\S]*?(?:\*\/|$)/g) ?? [];

const stringContents = (path: string, text: string): readonly string[] =>
  descendants(parse(path, text)).flatMap((node) =>
    ts.isStringLiteralLike(node) || ts.isTemplateLiteralToken(node)
      ? [node.text]
      : [],
  );

const ARBITRARY_TAILWIND = [
  /\w-\[[^\]\s]+\]/,
  /(?:^|\s)\S*\[[^\]\s]+\]:/,
  /(?:^|\s)!?\[[a-z-]+:[^\]\s]+\]/,
] as const;

const hasArbitraryValue = (value: string): boolean =>
  ARBITRARY_TAILWIND.some((pattern) => pattern.test(value));

const HEX_COLOR = /(?<![\w&])#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/i;

const HEX_ALLOWED: readonly string[] = ["app/globals.css", "lib/theme.ts"];

const EMOJI = /(?![\u00a9\u00ae\u2122])\p{Extended_Pictographic}|\ufe0f/u;

const RUNTIME_DEPENDENCIES: readonly string[] = ["next", "react", "react-dom"];

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

  it("writes hex colors only in app/globals.css and lib/theme.ts, which define the color tokens", () => {
    expect(
      pathsWhere(
        ({ path, text }) => !HEX_ALLOWED.includes(path) && HEX_COLOR.test(text),
      ),
    ).toEqual([]);
  });

  it("uses no arbitrary Tailwind values in class strings or @apply", () => {
    expect(
      pathsWhere(({ path, text }) =>
        isScript(path)
          ? stringContents(path, text).some(hasArbitraryValue)
          : text
              .split("\n")
              .filter((line) => /@apply\b/.test(line))
              .some(hasArbitraryValue),
      ),
    ).toEqual([]);
  });

  it("has no code comments in src, e2e or scripts", () => {
    expect(
      repoSources
        .filter(({ path, text }) =>
          isScript(path)
            ? scriptComments(path, text).length > 0
            : cssComments(text).length > 0,
        )
        .map(({ path }) => path),
    ).toEqual([]);
  });

  it("has no emoji in src, e2e or scripts", () => {
    expect(
      repoSources
        .filter(({ text }) => EMOJI.test(text))
        .map(({ path }) => path),
    ).toEqual([]);
  });

  it("depends at runtime on exactly next, react and react-dom", () => {
    const manifest: { readonly dependencies?: Record<string, string> } =
      JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
    expect(Object.keys(manifest.dependencies ?? {}).sort()).toEqual(
      RUNTIME_DEPENDENCIES,
    );
  });
});
