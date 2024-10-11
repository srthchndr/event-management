import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email';
import { VerificationEmailTemplate } from '@/app/api/register/verification-email-template'
import { Resend } from 'resend';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { firstName, lastName, email, password } = await req.json()
    
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        emailVerified: null,
        password: hashedPassword
      }
    })

    const verificationToken = await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: `${user.id}-${Date.now()}`,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    })

    // Send verification email
    try {
      const { data, error } = await resend.emails.send({
        from: 'Eventify <onboarding@resend.dev>',
        to: user.email,
        subject: 'Verify email for Eventify',
        react: VerificationEmailTemplate({name :user.name, verificationLink: `${process.env.NEXTAUTH_URL}/verify?token=${verificationToken.token}`}),
      });
  
      if (error) {        
        return Response.json({ error }, { status: 500 });
      }
  
      return Response.json(data);
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: "An error occurred while registering" }, { status: 500 })
  }
}