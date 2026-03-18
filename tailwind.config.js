export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "var(--text)",
        heading: "var(--text-h)",
        bg: "var(--bg)",
        border: "var(--border)",
        accent: "var(--accent)",
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        rajdhani: ["Rajdhani", "sans-serif"],
      },
      boxShadow: {
        custom:
          "rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px",
      },
    },
  },
  plugins: [],
}