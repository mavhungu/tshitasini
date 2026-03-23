import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// In-memory rate limiter: max 3 submissions per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function rateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }
  if (entry.count >= 3) return false
  entry.count += 1
  return true
}

const contactSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(20),
})

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { message: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const data = contactSchema.parse(body)

    // Log submission — email integration (Resend) to be added in a later phase
    console.log('📩 Contact form submission:', {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone ?? 'Not provided',
      subject: data.subject,
      message: data.message,
      receivedAt: new Date().toISOString(),
    })

    return NextResponse.json(
      { success: true, message: 'Message received. We will be in touch soon.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid form data.', errors: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: 'Internal server error.' },
      { status: 500 }
    )
  }
}
