import localFont from "next/font/local";

export const poppins = localFont({
  src: [
    {
      path: "../assets/fonts/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
  display: "swap",
});

export const allRoundGothic = localFont({
  src: [
    {
      path: "../assets/fonts/AllRoundGothic-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-all-round-gothic-family",
  display: "swap",
  preload: false,
});

export const appleChancery = localFont({
  src: [
    {
      path: "../assets/fonts/Apple-Chancery.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-apple-chancery-family",
  display: "swap",
  preload: false,
  adjustFontFallback: "Times New Roman",
});

export const palatino = localFont({
  src: [
    {
      path: "../assets/fonts/Palatino-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Palatino-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/Palatino-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Palatino-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-palatino-family",
  display: "swap",
  preload: false,
  adjustFontFallback: "Times New Roman",
});

export const altun = localFont({
  src: [
    {
      path: "../assets/fonts/Altun-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-altun-family",
  display: "swap",
  preload: false,
});

export const izmir = localFont({
  src: [
    {
      path: "../assets/fonts/Ahmet Altun - Izmir-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Ahmet Altun - Izmir-Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-izmir-family",
  display: "swap",
  preload: false,
});

export const extraFontVariables = [
  allRoundGothic.variable,
  appleChancery.variable,
  palatino.variable,
  altun.variable,
  izmir.variable,
].join(" ");
