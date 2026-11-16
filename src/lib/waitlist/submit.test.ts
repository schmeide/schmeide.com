import { describe, expect, it, vi } from "vitest";
import { pickAdapter } from "./submit";
import type { Fetch } from "./submit";

const entry = {
  name: "Ada",
  email: "ada@example.com",
  business: "A bakery",
};

const respondWith = (status: number): Fetch =>
  vi.fn<Fetch>(async () => new Response(null, { status }));

describe("pickAdapter", () => {
  it("does not send anything when no endpoint is set", async () => {
    const send = respondWith(200);
    const log = vi.fn();
    const result = await pickAdapter(null, send, log)(entry);
    expect(result).toEqual({ status: "unconfigured" });
    expect(send).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledOnce();
  });

  it("posts the entry as JSON to the endpoint", async () => {
    const send = respondWith(200);
    const result = await pickAdapter(
      "https://example.com/w",
      send,
      null,
    )(entry);
    expect(result).toEqual({ status: "saved" });
    expect(send).toHaveBeenCalledWith(
      "https://example.com/w",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(entry),
      }),
    );
  });

  it("reports a rejected submission", async () => {
    const result = await pickAdapter(
      "https://example.com/w",
      respondWith(422),
      null,
    )(entry);
    expect(result).toEqual({ status: "failed", reason: "rejected" });
  });

  it("turns a network error into a failed result", async () => {
    const send = vi.fn<Fetch>(async () => {
      throw new TypeError("offline");
    });
    const result = await pickAdapter(
      "https://example.com/w",
      send,
      null,
    )(entry);
    expect(result).toEqual({ status: "failed", reason: "network" });
  });
});
