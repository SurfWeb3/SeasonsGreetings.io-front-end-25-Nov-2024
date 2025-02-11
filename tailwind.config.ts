import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    transitionProperty: {
      'height': 'height',
    },
    screens: {
      mobsm: "320px",
      mobmd: "375px",
      moblg: "425px",
      tablet: "768px",
      laptop: "1024px",
      desktop: "1440px",
    },
  },
  plugins: [],
};
export default config;
