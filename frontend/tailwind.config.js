/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chlorophy: {
          green: '#10B981',
          cyan: '#06B6D4',
          lime: '#84CC16',
        }
      }
    },
  },
  plugins: [],
}

