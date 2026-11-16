import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PRODUCT_NAME, site } from "@/content";
import { OG_IMAGE_SIZE, THEME_COLORS } from "@/lib/theme";

export const dynamic = "force-static";

const fontPath = (file: string) => join(process.cwd(), "assets", "fonts", file);

export async function GET() {
  const [displayData, sansData] = await Promise.all([
    readFile(fontPath("YoungSerif-Regular.ttf")),
    readFile(fontPath("Figtree-Medium.ttf")),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: THEME_COLORS.ink,
        color: THEME_COLORS.surface,
      }}
    >
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            padding: "8px 28px",
            borderRadius: 20,
            background: THEME_COLORS.butter,
            color: THEME_COLORS.ink,
            fontFamily: "Young Serif",
            fontSize: 72,
          }}
        >
          {PRODUCT_NAME}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "Figtree",
          fontSize: 64,
          lineHeight: 1.15,
          maxWidth: 960,
        }}
      >
        {site.meta.tagline}
      </div>
    </div>,
    {
      ...OG_IMAGE_SIZE,
      fonts: [
        {
          name: "Young Serif",
          data: displayData,
          weight: 400,
          style: "normal",
        },
        { name: "Figtree", data: sansData, weight: 500, style: "normal" },
      ],
    },
  );
}
