import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  // Dark mode is handled via CSS custom properties on [data-theme="dark"] — not Tailwind's darkMode class
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'border-color': 'var(--border)',
        'accent': 'var(--accent)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
      },
      fontFamily: {
        // TODO: swap to The Seasons when self-hosted files are available in /public/fonts/
        seasons: ['var(--font-seasons)', 'Cormorant Garant', 'serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
