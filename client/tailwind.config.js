/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#4A2C40',
          purpleHover: '#3B2233',
          gold: '#C59B27',
          goldHover: '#AE851D',
          gray: '#F8F5F6',
          darkText: '#2D2D2D'
        }
      }
    },
  },
  plugins: [],
}
