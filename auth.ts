import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import Passkey from "next-auth/providers/passkey";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google"
 
const prisma = new PrismaClient()
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Passkey,
    Credentials({
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        credentials: {
          email: {},
          password: {},
        },
        authorize: async (credentials) => {
            console.log(credentials);
            
          let user = null
   
          // logic to salt and hash password
        //   const pwHash = saltAndHashPassword(credentials.password)
   
          // logic to verify if the user exists
          user = await prisma.user.findUnique({
            where: {email: credentials.email as string}
          });
   
          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("User not found.")
          }
   
          // return user object with their profile data
          return user
        },
      }),
    ],
  callbacks: {
    async signIn({user, account, profile, email, credentials}) {
      console.log('SIGNIN\n', user, 'User\n', account, 'account\n', profile, 'profile\n', email, 'email\n', credentials, 'credentials\n');
      
      return true;
    }
  },
  experimental: { enableWebAuthn: true },
  session: { strategy: 'database'},
  pages: {
    signIn: '/signin',
    error: '/signin',
    verifyRequest: '/verify',
    newUser: '/',
  }
})
