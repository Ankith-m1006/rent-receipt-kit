import { defineTheme } from "@hyper-elements/react";

// The look of a receipt book from the stationery shop: printed labels in grey-black,
// the landlord's entries in blue ballpoint, a red serial number, faint blue rules.
export const receiptBook = defineTheme({
  colors: {
    background: "#EFECEE",
    foreground: "#2B2F3A",
    desk: "#2A2D36",
    paper: "#FCEAEC",
    print: "#9E1C33",
    serial: "#D7192F",
    label: "#8A3A48",
    ink: "#1F3FA6",
    stamp: "#6A3BA8",
    rule: "#E5A9B3",
    muted: "#6B6870",
    border: "#E5A9B3",
    primary: "#9E1C33",
    primaryForeground: "#FFFFFF",
    tint: "#FFFFFF",
  },

  fonts: {
    body: "Hind, 'Segoe UI', Arial, sans-serif",
    heading: "Hind, 'Segoe UI', Arial, sans-serif",
    hand: "Kalam, 'Segoe Print', 'Comic Sans MS', cursive",
  },
  fontSizes: { body: 15 },
  lineHeights: { body: 1.5 },
  elements: {
    Heading: { by: { level: { 1: { fontSize: 26, fontWeight: 700 }, 2: { fontSize: 19, fontWeight: 600 } } } },
    Button: { borderRadius: 6, padding: [12, 22], fontWeight: 600, hover: { backgroundColor: "#7E1427" } },
  },
  styles: {
    paper: { backgroundColor: "{colors.paper}", border: { width: 1, style: "solid", color: "{colors.rule}" }, borderRadius: 4 },
    hand: { fontFamily: "{fonts.hand}", color: "{colors.ink}" },
    label: { fontSize: 13, color: "{colors.label}" },
  },
});

// Web fonts for the email and the page (the PDF and the image are given the font files).
const cdn = "https://cdn.jsdelivr.net/npm/@fontsource";
export const webFonts = [
  { family: "Hind", src: `${cdn}/hind@5.1.0/files/hind-latin-400-normal.woff2`, format: "woff2" as const, weight: 400 },
  { family: "Hind", src: `${cdn}/hind@5.1.0/files/hind-latin-600-normal.woff2`, format: "woff2" as const, weight: 600 },
  { family: "Hind", src: `${cdn}/hind@5.1.0/files/hind-latin-700-normal.woff2`, format: "woff2" as const, weight: 700 },
  { family: "Kalam", src: `${cdn}/kalam@5.1.0/files/kalam-latin-400-normal.woff2`, format: "woff2" as const, weight: 400 },
  { family: "Kalam", src: `${cdn}/kalam@5.1.0/files/kalam-latin-700-normal.woff2`, format: "woff2" as const, weight: 700 },
];
