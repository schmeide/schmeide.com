import { describe, expect, it } from "vitest";
import { launchModeFor, pickForMode } from "./launch-mode";

describe("launchModeFor", () => {
  it.each([undefined, "", "invite", "OPEN", "closed"])(
    "defaults to invite for %s",
    (value) => {
      expect(launchModeFor(value)).toBe("invite");
    },
  );

  it("reads open", () => {
    expect(launchModeFor(" open ")).toBe("open");
  });
});

describe("pickForMode", () => {
  const choices = { invite: "Get early access", open: "Sign up" };

  it("picks the value for each mode", () => {
    expect(pickForMode(choices, "invite")).toBe("Get early access");
    expect(pickForMode(choices, "open")).toBe("Sign up");
  });
});
