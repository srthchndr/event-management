import { NextResponse } from 'next/server'
import { auth } from "@/auth"
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email
    })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json({ message: "An error occurred while fetching user data" }, { status: 500 })
  }
}