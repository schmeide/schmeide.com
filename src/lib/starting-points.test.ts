import { describe, expect, it } from "vitest";
import { startingPointFrom, withStartingPoint } from "./starting-points";

describe("startingPointFrom", () => {
  it("reads a known starting point", () => {
    expect(startingPointFrom("?start=invoices")).toBe("invoices");
  });

  it.each(["", "?start=", "?start=payroll", "?plan=invoices"])(
    "ignores %s",
    (search) => {
      expect(startingPointFrom(search)).toBeNull();
    },
  );
});

describe("withStartingPoint", () => {
  it("adds the starting point to a page on this site", () => {
    expect(withStartingPoint("/early-access/", "job-tracker")).toBe(
      "/early-access/?start=job-tracker",
    );
  });

  it("leaves an app address alone", () => {
    expect(withStartingPoint("https://app.example/sign-up", "invoices")).toBe(
      "https://app.example/sign-up",
    );
  });
});
