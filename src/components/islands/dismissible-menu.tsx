"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export type DismissibleMenuProps = {
  readonly children: ReactNode;
};

const isInside = (menu: HTMLDetailsElement, target: EventTarget | null) =>
  target instanceof Node && menu.contains(target);

const isLink = (target: EventTarget | null) =>
  target instanceof Element && target.closest("a[href]") !== null;

export const DismissibleMenu = ({ children }: DismissibleMenuProps) => {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const menu = ref.current;
    if (menu === null) {
      return undefined;
    }
    const close = () => {
      menu.open = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !menu.open) {
        return;
      }
      close();
      menu.querySelector("summary")?.focus();
    };
    const onClick = (event: MouseEvent) => {
      if (!menu.open) {
        return;
      }
      if (!isInside(menu, event.target) || isLink(event.target)) {
        close();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return <details ref={ref}>{children}</details>;
};
