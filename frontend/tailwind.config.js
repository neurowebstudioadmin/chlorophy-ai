/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        code: ['"Fira Code"', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        'chloro-primary': '#00FF7F',
        'chloro-secondary': '#7B68EE',
        'chloro-accent': '#FFD700',
        'chloro-dark': '#0A0E27',
        chlorophy: {
          green: '#10B981',
          cyan: '#06B6D4',
          lime: '#84CC16',
        }
      },
    },
  },
  plugins: [],
}