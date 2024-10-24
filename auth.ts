import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs";
import { LoginSchema } from "./schemas";
import { getUserByEmail, getUserById } from "./data/user";
import authConfig from "./auth.config";
 
const prisma = new PrismaClient()
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    // async signIn({ account, profile }) {
    //   if (account!.provider === "google") {
    //     const user = await prisma.user.findUnique({
    //       where: { email: profile!.email as string },
    //     })
    //     if (user) {
    //       await prisma.user.update({
    //         where: { id: user.id },
    //         data: { emailVerified: new Date() }
    //       })
    //     }
    //   }
    //   return true
    // },
    async jwt({ token }) {
      if(!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if(!existingUser) return token;

      token.role = existingUser.role;
      return token
    },
    async session({ session, token }) {
      if(token.sub && session.user) {
        session.user.id = token.sub;
      }

      if(token.role && session.user) {
        session.user.role = token.role;
      }
      return session
    }
  },
  session: { strategy: 'jwt'},
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  ...authConfig
})
