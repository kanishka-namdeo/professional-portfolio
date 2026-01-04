/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'color-bg': '#fafafa',
        'color-surface': '#ffffff',
        'color-border': '#0a0a0a',
        'color-text': '#0a0a0a',
        'color-text-muted': '#525252',
        'accent-navy': '#1e3a5f',
        'accent-teal': '#0d9488',
        'accent-coral': '#f97316',
        'accent-indigo': '#4f46e5',
        'accent-amber': '#d97706',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'hard': '4px 4px 0px 0px #0a0a0a',
        'hover': '6px 6px 0px 0px #0a0a0a',
      },
      spacing: {
        'xs': '0.5rem',
        'sm': '0.75rem',
        'md': '1.25rem',
        'lg': '2rem',
        'xl': '3rem',
        '2xl': '5rem',
      },
    },
  },
  plugins: [],
}
