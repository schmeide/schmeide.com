import { describe, expect, it } from "vitest";
import { heightFor, imageFilePath, imageSrcSet } from "./path";

describe("image paths", () => {
  it("builds a derivative path", () => {
    expect(imageFilePath("hero", 640, "avif")).toBe("/images/hero-640.avif");
  });

  it("builds a srcset with every width", () => {
    expect(imageSrcSet("hero", "webp")).toBe(
      "/images/hero-640.webp 640w, /images/hero-1024.webp 1024w, /images/hero-1600.webp 1600w",
    );
  });

  it("derives the height from the aspect ratio", () => {
    expect(heightFor(1600, { width: 4, height: 5 })).toBe(2000);
  });
});
