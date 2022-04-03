import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
// import { PrismaClient } from "@prisma/client"
import prisma from "../../../db"

export default NextAuth({
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code'
    })
    
    // ...add more providers here
  ],
  pages: {
      signIn: '/auth/signin',
  },
  jwt: {
    encryption: true
  },
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn({ account, profile }) {
        return profile // Do different verification for other providers that don't have `email_verified`
    },
  }
})