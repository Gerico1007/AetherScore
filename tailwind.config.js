/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.local.html",
    "./index.tsx",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nyro-blue': '#2E3A87',
        'aureon-green': '#00FFC2',
        'jam-red': '#F54E4E',
        'cosmic-bg': '#030712',
        'portal-border': '#1f2937',
      },
      animation: {
        'aurora': 'aurora 60s linear infinite',
      },
      keyframes: {
        'aurora': {
          'from': { 'background-position': '50% 50%, 50% 50%' },
          'to': { 'background-position': '350% 50%, 350% 50%' },
        },
      },
    },
  },
  plugins: [],
}
