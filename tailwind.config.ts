import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-roboto-mono)"],
      },
      colors: {
        whitecolor: "FCFCFC",
        lightgray: "#EFEFEF",
        lightpurple: "#6759FF",
        locationcolor: "#636A75",
        dashboardfontcolor: "#172B4D",
        bgsearch: "#FBFBFB",
        bordersearch: "#F2F2F2",
        acrepair: "#FFBC99",
        green1: "#D5F4ED",
        green2: "#B5EBCD",
        appliance: "#B1E5FC",
        otpblock: "#79747E",
        verifytext: "#757575",
        cleaning: "#FFD88D",
        plumbing: "#CBEBA4",
        electronics: "#FB9B9B",
        shifting: "#F8B0ED",
        lightpeach: "#FFE8E8",
        lemonyellow: "#C0BD7F",
        lightyellowA: "#FFFBE4",
        textgray: "#6F767E",
        lightgreen: "#83DD83",
        lightred: "#F19797",
        green4: "#1CC052",
        purple1: "#934DFB",
        lightyellowB: "#FFD88D",
        gray1:"#6F767E",
        peach:"#FFBC99",
        lightgreenA:"#B5E4CA",
        grayA:"#757575",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
