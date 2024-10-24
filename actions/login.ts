'use server';
import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validateValues = LoginSchema.safeParse(values);

    if(!validateValues.success) return {error: "Invalid fields"}

    const credentials = validateValues.data;

    try {
        await signIn('credentials', {
          email: credentials.email,
          password: credentials.password,
          redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
      } catch (error) {
        if(error instanceof AuthError) {
          switch(error.type) {
            case "CredentialsSignin":
              return { error: "Please use correct credentials." }
            default:
              return { error: "Something went wrong. Please try again later"}
          }
        }

        throw error;
      } 
}