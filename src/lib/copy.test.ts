import { describe, expect, it } from "vitest";
import { isShown, isShownIn, resolve } from "./copy";
import { PLACEHOLDER_MODE } from "./env";
import { placeholder, resolveCopy } from "./placeholder";
import type { Copy } from "./placeholder";

const samples: readonly (Copy | null)[] = [
  null,
  "Confirmed.",
  placeholder("pricing"),
  placeholder("support details", "We monitor it."),
];

describe("isShownIn", () => {
  it("never shows a missing value", () => {
    expect(isShownIn(null, "show")).toBe(false);
    expect(isShownIn(null, "hide")).toBe(false);
  });

  it("shows confirmed copy in both modes", () => {
    expect(isShownIn("Confirmed.", "show")).toBe(true);
    expect(isShownIn("Confirmed.", "hide")).toBe(true);
  });

  it("shows every placeholder in show mode", () => {
    expect(isShownIn(placeholder("pricing"), "show")).toBe(true);
    expect(isShownIn(placeholder("support", "We monitor it."), "show")).toBe(
      true,
    );
  });

  it("hides a placeholder without a fallback in hide mode", () => {
    expect(isShownIn(placeholder("pricing"), "hide")).toBe(false);
    expect(isShownIn(placeholder("support", "We monitor it."), "hide")).toBe(
      true,
    );
  });
});

describe("resolve and isShown", () => {
  it("use the build's placeholder mode", () => {
    samples.forEach((copy) => {
      expect(isShown(copy)).toBe(isShownIn(copy, PLACEHOLDER_MODE));
      if (copy !== null) {
        expect(resolve(copy)).toEqual(resolveCopy(copy, PLACEHOLDER_MODE));
      }
    });
  });
});
