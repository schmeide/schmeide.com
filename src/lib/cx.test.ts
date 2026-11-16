import { describe, expect, it } from "vitest";
import { cx } from "./cx";

describe("cx", () => {
  it("joins class names with a space", () => {
    expect(cx("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cx("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("returns an empty string for no input", () => {
    expect(cx()).toBe("");
  });
});
