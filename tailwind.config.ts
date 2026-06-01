import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f1f8f3',
          100: '#dcefe0',
          200: '#bbdec5',
          300: '#8cc69e',
          400: '#5ba775',
          500: '#3a8b58',
          600: '#2a6e44',
          700: '#235838',
          800: '#1d472f',
          900: '#173a27'
        },
        sand: {
          50: '#fbf8f3',
          100: '#f4ecdd',
          200: '#e8d8bb',
          300: '#d8bd8b'
        }
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    }
  },
  plugins: []
};
export default config;
