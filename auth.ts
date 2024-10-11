import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Passkey from "next-auth/providers/passkey";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs";
 
const prisma = new PrismaClient()
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
          email: {},
          password: {},
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }
  
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string
            }
          })
  
          if (!user || !user.password) {
            return null
          }
  
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )
  
          if (!isPasswordValid) {
            return null
          }
  
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            emailVerified: user.emailVerified?.toISOString()
          }
        }
      }),
    ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account!.provider === "google") {
        const user = await prisma.user.findUnique({
          where: { email: profile!.email as string },
        })
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { emailVerified: new Date() }
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.emailVerified = (user as any).emailVerified
      }
      return token
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.emailVerified = user.emailVerified
      }
      return session
    }
  },
  experimental: { enableWebAuthn: true },
  session: { strategy: 'jwt'},
  pages: {
    signIn: '/signin',
    error: '/signin',
    verifyRequest: '/verify',
    newUser: '/',
  }
})
