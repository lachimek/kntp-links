const dev = process.env.NODE_ENV !== 'production'

export const server = dev
  ? 'http://localhost:3000'
  : 'https://kntp-links-1texc8ksh-lachimek.vercel.app'
