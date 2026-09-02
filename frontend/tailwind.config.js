/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Centralize brand colors/spacing here later so components
      // never hard-code hex values.
      colors: {},
    },
  },
  plugins: [],
};
