"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verificationToken";
import { prisma } from "@/lib/prisma";

export const newVerification = async(token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if(!existingToken) return { error: "Cannot validate user"};

    const isExpired = new Date(existingToken.expires) < new Date();

    if(isExpired) return { error: "Link has expired, Try requesting new verification mail." };

    const existingUser = await getUserByEmail(existingToken.email);

    if(!existingUser) return { error: "User doesn't exist" };
  
    await prisma.user.update(
        { where: { id: existingUser.id }, data: { emailVerified: new Date() } }
    );

    await prisma.verificationToken.delete(
        { where: { identifier: existingToken.identifier }}
    )

    return { success: "Email verified successfully" };
}