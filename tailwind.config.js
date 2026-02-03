module.exports = {
  content: [
    // "./src/**/*.{js,jsx}",
    './src/**/*.{js,jsx,ts,tsx}',
    "./**/*.php",
  ],
  theme: {
    extend: {
      colors: {
        "semi-bg": "var(--semi-color-bg-0)",
        "semi-text": "var(--semi-color-text-0)",
        "semi-primary": "var(--semi-color-primary)"
      }
    }
  },
  plugins: [],
};
