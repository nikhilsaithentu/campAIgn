/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#14152B",
          coral: "#FF5A47",
          paper: "#FAFAF8",
          slate: "#6E7080",

          coralLight: "#FFF2EF",
          inkLight: "#F3F4F8",
          border: "#E7E8EE",
          success: "#2FBF71",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
      },

      boxShadow: {
        card: "0 10px 30px rgba(20,21,43,.06)",
        hover: "0 20px 40px rgba(20,21,43,.10)",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },

  plugins: [],
}