import { isExternalHref } from "./href";

export const STARTING_POINT_IDS = [
  "invoices",
  "bookings",
  "client-list",
  "stock-list",
  "job-tracker",
] as const;

export type StartingPointId = (typeof STARTING_POINT_IDS)[number];

export const START_PARAM = "start";

const isStartingPointId = (value: string): value is StartingPointId =>
  STARTING_POINT_IDS.some((id) => id === value);

export const startingPointFrom = (search: string): StartingPointId | null => {
  const value = new URLSearchParams(search).get(START_PARAM);
  return value !== null && isStartingPointId(value) ? value : null;
};

export const withStartingPoint = (
  href: string,
  start: StartingPointId,
): string =>
  isExternalHref(href)
    ? href
    : `${href}?${new URLSearchParams({ [START_PARAM]: start })}`;
