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
        'color-bg': 'var(--color-bg)',
        'color-surface': 'var(--color-surface)',
        'color-border': 'var(--color-border)',
        'color-text': 'var(--color-text)',
        'color-text-muted': 'var(--color-text-muted)',
        'color-surface-alt': 'var(--color-surface-alt)',
        'accent-navy': 'var(--accent-navy)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'hard': 'var(--shadow-hard)',
        'hover': 'var(--shadow-hover)',
      },
      spacing: {
        'xs': 'var(--space-xs)',
        'sm': 'var(--space-sm)',
        'md': 'var(--space-md)',
        'lg': 'var(--space-lg)',
        'xl': 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
      },
    },
  },
  plugins: [],
}
