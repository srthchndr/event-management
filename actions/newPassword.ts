"use server";

import { NewPasswordSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from 'bcryptjs';
import { getpasswordResetTokenByToken } from "@/data/passwordResetToken";
import { getUserByEmail } from "@/data/user";
import { prisma } from "@/lib/prisma";

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token: string | null) => {
    if(!token) return { error: "Missing token" };

    const validateValues = NewPasswordSchema.safeParse(values);

    if(!validateValues.success) return { error: "Enter valid values in password" };

    const {password, confirmPassword} = validateValues.data;

    if(password !== confirmPassword) return { error: "Entered passwords doesnt match" };

    const existingToken = await getpasswordResetTokenByToken(token);

    if(!existingToken) return { error: "Token is invalid" };

    const isExpired = new Date(existingToken.expires) < new Date();

    if(isExpired) return { error: "Token expired. Please request new reset mail"};
    
    const existingUser = await getUserByEmail(existingToken.email);

    if(!existingUser) return { error: "Email doesnt exist anymore" };

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { email: existingUser.email },
        data: { password: hashedPassword }
    });

    await prisma.passwordResetToken.delete({
        where: { identifier: existingToken.identifier }
    });

    return { success: "Successfully updated password" };
}