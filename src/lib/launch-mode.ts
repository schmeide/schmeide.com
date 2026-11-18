export type LaunchMode = "invite" | "open";

export type ByLaunchMode<T> = Readonly<Record<LaunchMode, T>>;

export const launchModeFor = (value: string | undefined): LaunchMode =>
  value?.trim() === "open" ? "open" : "invite";

export const pickForMode = <T>(choices: ByLaunchMode<T>, mode: LaunchMode): T =>
  choices[mode];
