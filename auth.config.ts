import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./data/user";
import bcrypt from 'bcryptjs';
 
export default { 
    providers: [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Credentials({
          async authorize(credentials) {
            const validatedValues = LoginSchema.safeParse(credentials);
  
            if(!validatedValues.success) return null;
  
            const {email, password} = validatedValues.data
            const user = await getUserByEmail(email);
    
            if (!user || !user.password) return null;
    
            const isPasswordValid = await bcrypt.compare(
              password,
              user.password
            );
    
            if (isPasswordValid) return user;
    
            return null;
          }
        }),
    ]
} satisfies NextAuthConfig