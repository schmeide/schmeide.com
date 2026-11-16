import { Figtree, Young_Serif } from "next/font/google";

export const displayFont = Young_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-young-serif",
});

export const sansFont = Figtree({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});
