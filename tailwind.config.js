/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        panel: "#1a1a1c",
        panelMuted: "#232327",
        line: "#2e2e33",
        accent: "#7aa2ff",
      },
    },
  },
  plugins: [],
};
