import { describe, expect, it } from "vitest";
import { placeholder } from "./placeholder";
import { isListed, isReady } from "./ready";

const confirmed = {
  title: "Invoicing",
  lead: "Plain words",
  items: ["one", "two"],
  image: { name: "shot", placeholder: false },
};

describe("isReady", () => {
  it("accepts a page whose copy is all confirmed", () => {
    expect(isReady(confirmed)).toBe(true);
  });

  it("rejects a page with a placeholder anywhere in it", () => {
    expect(isReady({ ...confirmed, items: ["one", placeholder("two")] })).toBe(
      false,
    );
  });

  it("rejects a page with a placeholder fallback, since it is still unconfirmed", () => {
    expect(isReady({ ...confirmed, lead: placeholder("lead", "Soon") })).toBe(
      false,
    );
  });

  it("rejects a page with a stand-in image", () => {
    expect(
      isReady({ ...confirmed, image: { name: "shot", placeholder: true } }),
    ).toBe(false);
  });
});

describe("isListed", () => {
  const pending = { lead: placeholder("lead") };

  it("lists every page while placeholders are shown", () => {
    expect(isListed(pending, "show")).toBe(true);
  });

  it("lists only ready pages when placeholders are hidden", () => {
    expect(isListed(pending, "hide")).toBe(false);
    expect(isListed(confirmed, "hide")).toBe(true);
  });
});
