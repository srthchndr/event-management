'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { RegisterSchema } from '@/schemas';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { getUserByEmail } from '@/data/user';
import { generatePasswordResetToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const validateValues = RegisterSchema.safeParse(values);

    if(!validateValues.success) return {error: 'Invalid data'};

  try {
    const { firstName, lastName, email, password } = validateValues.data;
    
    if (!firstName || !lastName || !email || !password) {
      return { error: "Missing fields" };
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already exists. Please login" };
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword
      }
    })

    const verificationToken = await generatePasswordResetToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    // Send verification email
    // try {
    //   const { data, error } = await resend.emails.send({
    //     from: 'Eventify <onboarding@resend.dev>',
    //     to: user.email,
    //     subject: 'Verify email for Eventify',
    //     react: VerificationEmailTemplate({name :user.name, verificationLink: `${process.env.NEXTAUTH_URL}/verify?token=${verificationToken.token}`}),
    //   });
  
    //   if (error) {        
    //     return { error: "Internal error please try again later" };
    //   }
  
    //   return {success: "Verification email sent successfully. Please verify to continue"};
    // } catch (error) {
    //   return { error: "Internal error please try again later" };
    // }
      return {success: "Verification email sent successfully. Please verify to continue"};
  } catch (error) {
    console.error('Registration error:', error)
    return { error: "An error occurred while registering" }
  }
}