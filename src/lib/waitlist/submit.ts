import { IS_DEVELOPMENT, WAITLIST_ENDPOINT } from "@/lib/env";
import type { SubmitWaitlist, WaitlistAdapter } from "./types";

export type Fetch = typeof fetch;

export type Log = (message: string) => void;

export const endpointAdapter =
  (endpoint: string, send: Fetch): WaitlistAdapter =>
  async (entry) => {
    try {
      const response = await send(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(entry),
      });
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
): WaitlistAdapter =>
  endpoint === null
    ? unconfiguredAdapter(log)
    : endpointAdapter(endpoint, send);

export const submitWaitlist: SubmitWaitlist = (entry) =>
  pickAdapter(
    WAITLIST_ENDPOINT,
    (...args) => fetch(...args),
    IS_DEVELOPMENT ? (message) => console.info(message) : null,
  )(entry);
