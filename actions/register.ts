'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { RegisterSchema } from '@/schemas';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { getUserByEmail } from '@/data/user';
import { generatePasswordResetToken, generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const validateValues = RegisterSchema.safeParse(values);

    if(!validateValues.success) return {error: 'Invalid data'};

  try {
    const { firstName, lastName, email, password, confirmPassword } = validateValues.data;
    
    if (!firstName || !lastName || !email || !password || !confirmPassword ) {
      return { error: "Missing fields" };
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Email already exists. Please login" };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword
      }
    })

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return {success: "Verification email sent successfully. Please verify to continue"};
  } catch (error) {
    console.error('Registration error:', error)
    return { error: "An error occurred while registering" }
  }
}