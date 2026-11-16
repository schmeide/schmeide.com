import { describe, expect, it } from "vitest";
import { isAnchorHref, toHomeHref } from "./href";

describe("isAnchorHref", () => {
  it("accepts an in-page anchor", () => {
    expect(isAnchorHref("#early-access")).toBe(true);
  });

  it("rejects a page path", () => {
    expect(isAnchorHref("/privacy/")).toBe(false);
  });
});

describe("toHomeHref", () => {
  it("points an anchor at the home page", () => {
    expect(toHomeHref("#how")).toBe("/#how");
  });

  it("leaves a page path alone", () => {
    expect(toHomeHref("/terms/")).toBe("/terms/");
  });
});
