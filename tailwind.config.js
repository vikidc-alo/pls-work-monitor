/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pls: {
          maroon: '#7A1215',
          darkGreen: '#0F4A32',
        }
      }
    },
  },
  plugins: [],
}