import { PLACEHOLDER_MODE } from "./env";
import { resolveCopy } from "./placeholder";
import type { Copy, ResolvedCopy } from "./placeholder";

export const PLACEHOLDER_LABEL = "Placeholder";

export const resolve = (copy: Copy): ResolvedCopy | null =>
  resolveCopy(copy, PLACEHOLDER_MODE);

export const isShown = (copy: Copy | null): copy is Copy =>
  copy !== null && resolve(copy) !== null;
