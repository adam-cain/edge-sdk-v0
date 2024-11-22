/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-color': '#f13939',
      },
    },
    screens: {
      'tall': { 'raw': '(max-aspect-ratio: 1/1)' },
      'wide': { 'raw': '(min-aspect-ratio: 1/1)' },
    },
  },
  plugins: [],
}

