import { ImageResponse } from "next/og";
import { PRODUCT_NAME } from "@/content";
import { THEME_COLORS, TOUCH_ICON_SIZE } from "@/lib/theme";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: THEME_COLORS.ink,
        color: THEME_COLORS.butter,
        fontSize: 120,
        fontWeight: 700,
      }}
    >
      {PRODUCT_NAME.slice(0, 1)}
    </div>,
    { width: TOUCH_ICON_SIZE, height: TOUCH_ICON_SIZE },
  );
}
