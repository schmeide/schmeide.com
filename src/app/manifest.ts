import type { MetadataRoute } from "next";
import { PRODUCT_NAME, site } from "@/content";
import { THEME_COLORS, TOUCH_ICON_PATH, TOUCH_ICON_SIZE } from "@/lib/theme";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: PRODUCT_NAME,
    short_name: PRODUCT_NAME,
    description: site.meta.description,
    start_url: "/",
    display: "browser",
    background_color: THEME_COLORS.surface,
    theme_color: THEME_COLORS.ink,
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      {
        src: TOUCH_ICON_PATH,
        type: "image/png",
        sizes: `${TOUCH_ICON_SIZE}x${TOUCH_ICON_SIZE}`,
      },
    ],
  };
}
