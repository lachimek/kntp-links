module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'night': "#2F2B3F"
      },
      dropShadow: {
        'tiktok': [
          '0 -1.5px -1.5px rgba(37, 244, 238, 1)',
          '0 1.5px 1.5px rgba(254, 44, 85, 1)'
        ]
      },
      animation: {
        'rotate-text': 'cycle 12s infinite'
      },
      keyframes: {
        cycle: {
          '0%': {transform: 'translateY(-87.5%)'},
          '14%': {transform: 'translateY(-75%)'},
          '28%': {transform: 'translateY(-62.5%)'},
          '42%': {transform: 'translateY(-50%)'},
          '56%': {transform: 'translateY(-37.5%)'},
          '70%': {transform: 'translateY(-25%)'},
          '84%': {transform: 'translateY(-12.5%)'},
          '100%': {transform: 'translateY(0%)'}
        }
      }
    },
  },
  plugins: [],
}
