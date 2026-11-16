import { describe, expect, it } from "vitest";
import { BUSINESS_MAX_LENGTH, validateWaitlist } from "./validate";

const valid = {
  name: "Ada",
  email: "ada@example.com",
  business: "A bakery that wants online orders",
};

describe("validateWaitlist", () => {
  it("accepts a complete entry", () => {
    expect(validateWaitlist(valid)).toEqual({ ok: true, value: valid });
  });

  it("trims every field", () => {
    expect(
      validateWaitlist({
        name: "  Ada ",
        email: " ada@example.com  ",
        business: "  A bakery ",
      }),
    ).toEqual({
      ok: true,
      value: { name: "Ada", email: "ada@example.com", business: "A bakery" },
    });
  });

  it("requires every field", () => {
    expect(validateWaitlist({ name: " ", email: "", business: "  " })).toEqual({
      ok: false,
      error: {
        name: "name_required",
        email: "email_required",
        business: "business_required",
      },
    });
  });

  it.each(["ada", "ada@", "ada@example", "a da@example.com", "@example.com"])(
    "rejects the email %s",
    (email) => {
      expect(validateWaitlist({ ...valid, email })).toEqual({
        ok: false,
        error: { email: "email_invalid" },
      });
    },
  );

  it("accepts a business line at the maximum length", () => {
    const business = "a".repeat(BUSINESS_MAX_LENGTH);
    expect(validateWaitlist({ ...valid, business }).ok).toBe(true);
  });

  it("rejects a business line over the maximum length", () => {
    const business = "a".repeat(BUSINESS_MAX_LENGTH + 1);
    expect(validateWaitlist({ ...valid, business })).toEqual({
      ok: false,
      error: { business: "business_too_long" },
    });
  });
});
