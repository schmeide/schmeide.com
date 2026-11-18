import type { PlaceholderMode } from "./placeholder";

export const isReady = (content: unknown): boolean => {
  if (Array.isArray(content)) {
    return content.every(isReady);
  }
  if (typeof content !== "object" || content === null) {
    return true;
  }
  if ("kind" in content && content.kind === "placeholder") {
    return false;
  }
  if ("placeholder" in content && content.placeholder === true) {
    return false;
  }
  return Object.values(content).every(isReady);
};

export const isListed = (content: unknown, mode: PlaceholderMode): boolean =>
  mode === "show" || isReady(content);
