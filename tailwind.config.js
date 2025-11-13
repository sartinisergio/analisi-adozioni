/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zanichelli: {
          red: '#E2001A',
          dark: '#1a1a1a',
        }
      }
    },
  },
  plugins: [],
}
