/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(220, 85%, 50%)',
        accent: 'hsl(170, 70%, 45%)',
        bg: 'hsl(220, 15%, 98%)',
        surface: 'hsl(220, 15%, 100%)',
        'text-primary': 'hsl(220, 15%, 15%)',
        'text-secondary': 'hsl(220, 15%, 40%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 15%, 10%, 0.08)',
      },
      animation: {
        'fast': '150ms cubic-bezier(0.22,1,0.36,1)',
        'base': '250ms cubic-bezier(0.22,1,0.36,1)',
        'slow': '400ms cubic-bezier(0.22,1,0.36,1)',
      }
    },
  },
  plugins: [],
}