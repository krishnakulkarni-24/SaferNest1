/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        saferPrimary: "#2563EB",
        saferSecondary: "#1E40AF",
        saferAccent: "#F97316",
        saferDanger: "#EF4444",
        saferSuccess: "#22C55E",
        saferBg: "#F9FAFB",
        saferText: "#111827",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
