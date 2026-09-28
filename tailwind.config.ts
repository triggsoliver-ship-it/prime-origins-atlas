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
        },
        /**
         * The group's warm-gold accent (assets/site.css and lib/ecosystem.ts on
         * primeoriginsglobal.org and primeorigins.org: --gold / --gold-bright).
         * Added so Atlas's accents, headline emphasis and primary actions can
         * carry the same family resemblance instead of forest-green-only.
         */
        gold: {
          50: '#fbf3e2',
          100: '#f6e6c2',
          200: '#edd59a',
          300: '#e4c171',
          400: '#f2c566',
          500: '#d9a441',
          600: '#b3863a',
          700: '#8a6626',
          800: '#5c4419',
          900: '#3d2d10'
        }
      },
      fontFamily: {
        /** Inter + Fraunces, loaded in app/layout.tsx — same pairing as the
         *  rest of the group (primeoriginsglobal.org, primeorigins.org). */
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif']
      },
      boxShadow: {
        soft: '0 1px 2px rgba(23, 58, 39, 0.04), 0 8px 24px -12px rgba(23, 58, 39, 0.18)',
        lift: '0 4px 12px -2px rgba(23, 58, 39, 0.10), 0 18px 40px -16px rgba(23, 58, 39, 0.28)'
      }
    }
  },
  plugins: []
};
export default config;
