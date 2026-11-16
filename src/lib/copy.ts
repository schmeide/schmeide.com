import { PLACEHOLDER_MODE } from "./env";
import { resolveCopy } from "./placeholder";
import type { Copy, PlaceholderMode, ResolvedCopy } from "./placeholder";

export const isShownIn = (
  copy: Copy | null,
  mode: PlaceholderMode,
): copy is Copy => copy !== null && resolveCopy(copy, mode) !== null;

export const resolve = (copy: Copy): ResolvedCopy | null =>
  resolveCopy(copy, PLACEHOLDER_MODE);

export const isShown = (copy: Copy | null): copy is Copy =>
  isShownIn(copy, PLACEHOLDER_MODE);
