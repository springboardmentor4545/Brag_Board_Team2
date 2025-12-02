/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#ffffff',
        accent: '#16a34a',
        muted: '#6b7280',
        brandBlue: '#2563eb',
        brandRed: '#ef4444',
        brandYellow: '#f59e0b',
        brandGreen: '#10b981',
        brandOrange: '#f97316'
      }
    },
  },
  plugins: [],
}
