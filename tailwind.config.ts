import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bombovo-dark': '#080708',
        'bombovo-blue': '#3772FF',
        'bombovo-red': '#DF2935',
        'bombovo-yellow': '#FDCA40',
        'bombovo-gray': '#E6E8E6',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        handwritten: ['var(--font-amatic)', 'cursive'],
        amatic: ['var(--font-amatic)', 'cursive'],
      },
      fontSize: {
        '3.5xl': '40px',
        '5.5xl': '40px',
      },
    },
  },
  plugins: [],
}
export default config

