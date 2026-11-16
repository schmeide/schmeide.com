import { afterEach, describe, expect, it, vi } from "vitest";
import { SUBMIT_TIMEOUT_MS, pickAdapter } from "./submit";
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

describe("pickAdapter timeout", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const never: Fetch = vi.fn<Fetch>(() => new Promise<Response>(() => {}));

  it("fails with a network reason when the endpoint never responds", async () => {
    vi.useFakeTimers();
    const pending = pickAdapter("https://example.com/w", never, null)(entry);
    const settled = vi.fn();
    void pending.then(settled);
    await vi.advanceTimersByTimeAsync(SUBMIT_TIMEOUT_MS - 1);
    expect(settled).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await expect(pending).resolves.toEqual({
      status: "failed",
      reason: "network",
    });
  });

  it("passes an abort signal to send", async () => {
    const send = respondWith(200);
    await pickAdapter("https://example.com/w", send, null)(entry);
    expect(send).toHaveBeenCalledWith(
      "https://example.com/w",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("uses the injected signal factory", async () => {
    const controller = new AbortController();
    const timeout = vi.fn(() => controller.signal);
    const pending = pickAdapter(
      "https://example.com/w",
      never,
      null,
      timeout,
    )(entry);
    expect(timeout).toHaveBeenCalledWith(SUBMIT_TIMEOUT_MS);
    controller.abort();
    await expect(pending).resolves.toEqual({
      status: "failed",
      reason: "network",
    });
  });

  it("does not affect a fast success", async () => {
    vi.useFakeTimers();
    const result = await pickAdapter(
      "https://example.com/w",
      respondWith(200),
      null,
    )(entry);
    expect(result).toEqual({ status: "saved" });
    await vi.advanceTimersByTimeAsync(SUBMIT_TIMEOUT_MS);
    expect(result).toEqual({ status: "saved" });
  });
});
