import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { THEME_COLORS } from "./theme";

const css = readFileSync(
  join(process.cwd(), "src", "app", "globals.css"),
  "utf8",
);

const tokenNames = {
  ink: "ink",
  surface: "surface",
  mint: "mint",
  onInkMuted: "on-ink-muted",
  butter: "butter",
} as const satisfies Record<keyof typeof THEME_COLORS, string>;

describe("theme colors", () => {
  it.each(Object.entries(tokenNames))(
    "%s matches its CSS token",
    (key, token) => {
      expect(css).toContain(
        `--color-${token}: ${THEME_COLORS[key as keyof typeof THEME_COLORS]};`,
      );
    },
  );
});
