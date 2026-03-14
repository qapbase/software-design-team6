/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      colors: {

        /* Primary layout colors */
        primary: "#050725",       // sidebar / dark base
        secondary: "#2C2F45",     // dark cards

        /* Background system */
        background: "#ECDFC7",    // main page background
        surface: "#F4E9DA",       // light cards

        /* Accent color */
        accent: "#F9B672",        // buttons / highlights

        /* Neutral UI */
        neutral: "#84848A",       // borders / secondary text

        /* Charts / analytics */
        analytics: "#3A3F8F",     // graph line color

      },


      borderRadius: {
        xl: "14px",
        "2xl": "18px",
      },


      boxShadow: {

        card: "0 6px 20px rgba(0,0,0,0.08)",

        panel: "0 8px 28px rgba(0,0,0,0.12)",

      },


      fontFamily: {
        display: ["DM Sans", "system-ui", "sans-serif"],
      },

    },
  },

  plugins: [],
};