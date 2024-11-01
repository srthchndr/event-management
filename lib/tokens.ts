import { getVerificationTokenByEmail } from '@/data/verificationToken';
import {v4 as uuid} from 'uuid';
import { prisma } from './prisma';
import { getPasswordResetTokenByEmail } from '@/data/passwordResetToken';

export const generateVerificationToken = async (email: string) => {
    const token = uuid();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken) {
        await prisma.verificationToken.delete({ where: { identifier: existingToken.identifier }});
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {email, token, expires}
    })

    return verificationToken;
}

export const generatePasswordResetToken = async (email: string) => {
    const token = uuid();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if(existingToken) {
        await prisma.passwordResetToken.delete({ where: { identifier: existingToken.identifier }});
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {email, token, expires}
    })

    return passwordResetToken;
}