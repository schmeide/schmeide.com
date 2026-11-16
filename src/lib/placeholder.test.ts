import { describe, expect, it } from "vitest";
import {
  isConfirmed,
  isPlaceholder,
  placeholder,
  placeholderModeFor,
  resolveCopy,
} from "./placeholder";

describe("placeholder", () => {
  it("marks an unconfirmed item with a note and no fallback", () => {
    expect(placeholder("pricing")).toEqual({
      kind: "placeholder",
      note: "pricing",
      fallback: null,
    });
  });

  it("tells placeholders and confirmed copy apart", () => {
    expect(isPlaceholder(placeholder("bio"))).toBe(true);
    expect(isPlaceholder("Confirmed.")).toBe(false);
    expect(isConfirmed("Confirmed.")).toBe(true);
    expect(isConfirmed(placeholder("bio"))).toBe(false);
  });
});

describe("placeholderModeFor", () => {
  it("hides placeholders only in production builds", () => {
    expect(placeholderModeFor("production")).toBe("hide");
    expect(placeholderModeFor("development")).toBe("show");
    expect(placeholderModeFor("test")).toBe("show");
    expect(placeholderModeFor(undefined)).toBe("show");
  });
});

describe("resolveCopy", () => {
  it("passes confirmed copy through in both modes", () => {
    const expected = { text: "Confirmed.", pendingNote: null };
    expect(resolveCopy("Confirmed.", "show")).toEqual(expected);
    expect(resolveCopy("Confirmed.", "hide")).toEqual(expected);
  });

  it("shows the note next to the fallback in show mode", () => {
    expect(
      resolveCopy(placeholder("support details", "We monitor it."), "show"),
    ).toEqual({
      text: "We monitor it.",
      pendingNote: "support details",
    });
    expect(resolveCopy(placeholder("pricing"), "show")).toEqual({
      text: "",
      pendingNote: "pricing",
    });
  });

  it("renders only the fallback in hide mode", () => {
    expect(
      resolveCopy(placeholder("support details", "We monitor it."), "hide"),
    ).toEqual({
      text: "We monitor it.",
      pendingNote: null,
    });
  });

  it("drops a placeholder with no fallback in hide mode", () => {
    expect(resolveCopy(placeholder("pricing"), "hide")).toBeNull();
  });
});
