import { IS_DEVELOPMENT, WAITLIST_ENDPOINT } from "@/lib/env";
import type { SubmitWaitlist, WaitlistAdapter } from "./types";

export type Fetch = typeof fetch;

export type Log = (message: string) => void;

export type TimeoutSignal = (milliseconds: number) => AbortSignal;

export const SUBMIT_TIMEOUT_MS = 10_000;

export const timeoutSignal: TimeoutSignal = (milliseconds) => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), milliseconds);
  return controller.signal;
};

const whenAborted = (signal: AbortSignal): Promise<never> =>
  new Promise((_, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    signal.addEventListener("abort", () => reject(signal.reason), {
      once: true,
    });
  });

export const endpointAdapter =
  (
    endpoint: string,
    send: Fetch,
    timeout: TimeoutSignal = timeoutSignal,
  ): WaitlistAdapter =>
  async (entry) => {
    try {
      const signal = timeout(SUBMIT_TIMEOUT_MS);
      const response = await Promise.race([
        send(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(entry),
          signal,
        }),
        whenAborted(signal),
      ]);
      return response.ok
        ? { status: "saved" }
        : { status: "failed", reason: "rejected" };
    } catch {
      return { status: "failed", reason: "network" };
    }
  };

export const unconfiguredAdapter =
  (log: Log | null): WaitlistAdapter =>
  async () => {
    log?.("Waitlist endpoint is not configured. Nothing was sent.");
    return { status: "unconfigured" };
  };

export const pickAdapter = (
  endpoint: string | null,
  send: Fetch,
  log: Log | null,
  timeout: TimeoutSignal = timeoutSignal,
): WaitlistAdapter =>
  endpoint === null
    ? unconfiguredAdapter(log)
    : endpointAdapter(endpoint, send, timeout);

export const submitWaitlist: SubmitWaitlist = (entry) =>
  pickAdapter(
    WAITLIST_ENDPOINT,
    (...args) => fetch(...args),
    IS_DEVELOPMENT ? (message) => console.info(message) : null,
  )(entry);
