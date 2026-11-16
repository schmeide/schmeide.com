import { describe, expect, it } from "vitest";
import { err, ok, type Result } from "./result";

const describeResult = (result: Result<number, string>): string =>
  result.ok ? `value ${result.value}` : `error ${result.error}`;

describe("result", () => {
  it("wraps a value", () => {
    expect(ok(1)).toEqual({ ok: true, value: 1 });
  });

  it("wraps an error", () => {
    expect(err("bad")).toEqual({ ok: false, error: "bad" });
  });

  it("narrows on the ok flag", () => {
    expect(describeResult(ok(2))).toBe("value 2");
    expect(describeResult(err("bad"))).toBe("error bad");
  });
});
