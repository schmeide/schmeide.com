import type { ReactNode } from "react";

export type ContainerProps = {
  readonly children: ReactNode;
};

export const Container = ({ children }: ContainerProps) => (
  <div className="mx-auto w-full max-w-page px-gutter">{children}</div>
);
