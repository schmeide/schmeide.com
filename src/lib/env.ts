import { launchModeFor } from "./launch-mode";
import { placeholderModeFor } from "./placeholder";

export const PLACEHOLDER_MODE = placeholderModeFor(process.env.NODE_ENV);

export const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

export const LAUNCH_MODE = launchModeFor(process.env.NEXT_PUBLIC_LAUNCH_MODE);

export const WAITLIST_ENDPOINT =
  process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT?.trim() || null;
