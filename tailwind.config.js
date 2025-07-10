const { nextui } = require("@nextui-org/theme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(dropdown|toggle|menu|divider|popover|button|ripple|spinner).js",
  ],
  theme: {
    extend: {
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
        bebas: ["Bebas Neue", "sans-serif"],
      },
      colors: {
        "tg-orange": "#FF7A00",
        "tg-orange2": "#FF471F",
        "tg-orange-hover": "#d86700",
        "tg-orange2-hover": "#e13a16",
        "tg-orangel": "#FF7700",
      },
    },
  },
  plugins: [nextui()],
};
