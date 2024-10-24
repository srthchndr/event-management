"use server";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { PasswordResetSchema } from "@/schemas";
import { z } from "zod";

export const sendResetLink = async (values: z.infer<typeof PasswordResetSchema>)  => {
    const validatedValues = PasswordResetSchema.safeParse(values);

    if(!validatedValues.success) return { error: "Please enter a valid email"};

    const { email } = validatedValues.data;
    const existingUser = await getUserByEmail(email);

    if(!existingUser) return { error: "Email doesnt exist. Please register" };

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return { success: `Reset email sent to ${email}`}
}