import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3).max(50),
})

export const RegisterSchema = z.object({
    firstName: z.string().min(3).max(50),
    lastName: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(3).max(50),
    confirmPassword: z.string().min(3).max(50),
})

export const PasswordResetSchema = z.object({
    email: z.string().email()
})

export const NewPasswordSchema = z.object({
    password: z.string().min(3).max(50),
    confirmPassword: z.string().min(3).max(50)
})