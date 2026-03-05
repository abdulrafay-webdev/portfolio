/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00E5FF',
          purple: '#7B00FF',
        },
      },
      borderRadius: {
        'xl': '12px',
        'glass': '16px',
      },
      boxShadow: {
        'neon': '0 4px 16px rgba(0, 229, 255, 0.3)',
      },
    },
  },
  plugins: [],
}
