import { describe, expect, it } from "vitest";
import type { ImageSlot } from "../src/lib/images/types";
import {
  QUALITY,
  findSourceFile,
  jobsForSlot,
  jobsForSlots,
  resizeOptionsFor,
  resolveSourcePath,
  summaryMessage,
  targetPath,
} from "./build-images";

const slot = (name: string, width: number, height: number): ImageSlot => ({
  name,
  alt: "",
  aspectRatio: { width, height },
  placeholder: false,
  source: { credit: "", license: "", url: null },
});

describe("findSourceFile", () => {
  it("matches a file by its name without the extension", () => {
    expect(findSourceFile(["hero.jpg", "problem.jpg"], "problem")).toBe(
      "problem.jpg",
    );
  });

  it("accepts any extension, including uppercase", () => {
    expect(findSourceFile(["hero.JPEG"], "hero")).toBe("hero.JPEG");
    expect(findSourceFile(["hero.png"], "hero")).toBe("hero.png");
  });

  it("matches a file with no extension", () => {
    expect(findSourceFile(["hero"], "hero")).toBe("hero");
  });

  it("only strips the last extension", () => {
    expect(findSourceFile(["hero.final.jpg"], "hero")).toBeUndefined();
    expect(findSourceFile(["hero.final.jpg"], "hero.final")).toBe(
      "hero.final.jpg",
    );
  });

  it("does not match a prefix or a longer name", () => {
    expect(
      findSourceFile(["hero-2.jpg", "heroes.jpg"], "hero"),
    ).toBeUndefined();
  });

  it("returns the first match when several share a name", () => {
    expect(findSourceFile(["hero.png", "hero.jpg"], "hero")).toBe("hero.png");
  });

  it("returns undefined for an empty directory", () => {
    expect(findSourceFile([], "hero")).toBeUndefined();
  });
});

describe("resolveSourcePath", () => {
  it("joins the directory and the matched file", () => {
    expect(resolveSourcePath("/src/assets", ["hero.jpg"], "hero")).toBe(
      "/src/assets/hero.jpg",
    );
  });

  it("throws a message naming the slot when the source is missing", () => {
    expect(() =>
      resolveSourcePath("/src/assets", ["hero.jpg"], "team"),
    ).toThrow('No source photo for the "team" slot');
  });
});

describe("targetPath", () => {
  it("places the derivative under the public directory", () => {
    expect(targetPath("/site/public", "hero", 640, "avif")).toBe(
      "/site/public/images/hero-640.avif",
    );
  });

  it("encodes name, width and format in the file name", () => {
    expect(targetPath("/site/public", "problem", 1600, "webp")).toBe(
      "/site/public/images/problem-1600.webp",
    );
  });
});

describe("resizeOptionsFor", () => {
  it("covers and centres", () => {
    expect(resizeOptionsFor(640, { width: 1, height: 1 })).toEqual({
      width: 640,
      height: 640,
      fit: "cover",
      position: "centre",
    });
  });

  it("computes height for landscape ratios", () => {
    expect(resizeOptionsFor(1600, { width: 16, height: 9 }).height).toBe(900);
  });

  it("computes height for portrait ratios", () => {
    expect(resizeOptionsFor(1024, { width: 4, height: 5 }).height).toBe(1280);
  });

  it("rounds fractional heights", () => {
    expect(resizeOptionsFor(640, { width: 3, height: 2 }).height).toBe(427);
    expect(resizeOptionsFor(1024, { width: 3, height: 1 }).height).toBe(341);
  });

  it("keeps the requested width unchanged", () => {
    expect(resizeOptionsFor(1024, { width: 7, height: 3 }).width).toBe(1024);
  });
});

describe("jobsForSlot", () => {
  it("makes one job per width and format", () => {
    const jobs = jobsForSlot(slot("hero", 16, 9));
    expect(jobs).toHaveLength(6);
    expect(jobs.map((job) => `${job.width}.${job.format}`)).toEqual([
      "640.avif",
      "640.webp",
      "1024.avif",
      "1024.webp",
      "1600.avif",
      "1600.webp",
    ]);
  });

  it("carries the slot name and aspect ratio", () => {
    const jobs = jobsForSlot(slot("hero", 4, 3));
    expect(
      jobs.every(
        (job) =>
          job.name === "hero" &&
          job.aspectRatio.width === 4 &&
          job.aspectRatio.height === 3,
      ),
    ).toBe(true);
  });
});

describe("jobsForSlots", () => {
  it("returns no jobs for no slots", () => {
    expect(jobsForSlots([])).toEqual([]);
  });

  it("keeps slot order and yields unique targets", () => {
    const jobs = jobsForSlots([slot("hero", 16, 9), slot("problem", 1, 1)]);
    expect(jobs).toHaveLength(12);
    expect(jobs[0]?.name).toBe("hero");
    expect(jobs[11]?.name).toBe("problem");
    const targets = jobs.map((job) =>
      targetPath("/p", job.name, job.width, job.format),
    );
    expect(new Set(targets).size).toBe(12);
  });
});

describe("quality and summary", () => {
  it("defines a quality for every format", () => {
    expect(QUALITY).toEqual({ avif: 50, webp: 72 });
  });

  it("reports the file count", () => {
    expect(summaryMessage(12)).toBe("Wrote 12 files to public/images");
  });
});
