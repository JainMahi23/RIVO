/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#18432F',
          light: '#2F5F44',
          dark: '#0F2E20',
        },
        cream: {
          DEFAULT: '#F6F3EB',
          dark: '#EBE4D0',
        },
        gold: {
          DEFAULT: '#D49B35',
          dark: '#B87F22',
          light: '#E8BE6E',
        },
        terracotta: {
          DEFAULT: '#C86D51',
          dark: '#A8563D',
        },
        ink: '#23291F',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 2px 10px rgba(24, 67, 47, 0.08)',
        card: '0 1px 3px rgba(24, 67, 47, 0.10), 0 8px 20px -6px rgba(24, 67, 47, 0.12)',
      },
      backgroundImage: {
        'field-lines': "repeating-linear-gradient(180deg, rgba(24,67,47,0.05) 0px, rgba(24,67,47,0.05) 1px, transparent 1px, transparent 14px)",
      },
    },
  },
  plugins: [],
};
