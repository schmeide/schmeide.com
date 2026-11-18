import { describe, expect, it } from "vitest";
import {
  appHref,
  isAnchorHref,
  isExternalHref,
  isPlainHref,
  toHomeHref,
} from "./href";

describe("isAnchorHref", () => {
  it("accepts an in-page anchor", () => {
    expect(isAnchorHref("#early-access")).toBe(true);
  });

  it("rejects a page path", () => {
    expect(isAnchorHref("/privacy/")).toBe(false);
  });
});

describe("isPlainHref", () => {
  it("accepts an anchor and an address on another site", () => {
    expect(isPlainHref("#how")).toBe(true);
    expect(isExternalHref("https://app.example/sign-in")).toBe(true);
    expect(isPlainHref("https://app.example/sign-in")).toBe(true);
  });

  it("rejects a page path and a home-page anchor", () => {
    expect(isPlainHref("/early-access/")).toBe(false);
    expect(isPlainHref("/#how")).toBe(false);
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

describe("appHref", () => {
  const app = "https://app.example";

  it("builds the sign-in address", () => {
    expect(appHref(app, { name: "signIn" })).toBe(
      "https://app.example/sign-in",
    );
  });

  it("builds the sign-up address without a plan", () => {
    expect(appHref(app, { name: "signUp" })).toBe(
      "https://app.example/sign-up",
    );
  });

  it("carries an encoded plan on sign-up", () => {
    expect(appHref(app, { name: "signUp", plan: "small team" })).toBe(
      "https://app.example/sign-up?plan=small+team",
    );
  });
});
