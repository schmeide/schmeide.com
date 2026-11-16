import { placeholderModeFor } from "./placeholder";

export const PLACEHOLDER_MODE = placeholderModeFor(process.env.NODE_ENV);

export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

export const WAITLIST_ENDPOINT =
  process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT?.trim() || null;
