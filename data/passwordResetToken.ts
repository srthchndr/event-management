import { prisma } from "@/lib/prisma";

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findFirst({ where: { email }});
        return passwordResetToken;
    } catch {
        return null;
    }
}

export const getpasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findUnique({ where: { token }});
        return passwordResetToken;
    } catch {
        return null;
    }
}