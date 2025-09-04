import { NextRequest, NextResponse } from 'next/server';

// Rate limiting: Simple in-memory store (for production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);

  if (!limit || now > limit.resetTime) {
    // Reset or initialize
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + 60 * 60 * 1000, // 1 hour window
    });
    return true;
  }

  if (limit.count >= 5) {
    // Max 5 submissions per hour per IP
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  // Note: API routes don't work with static export (output: 'export')
  // This will only work if deployed to a server that supports API routes

  try {
    // Dynamically import postmark to avoid build issues
    const postmark = await import('postmark');

    // Initialize Postmark client only if token is available
    const client = process.env.POSTMARK_SERVER_TOKEN
      ? new postmark.ServerClient(process.env.POSTMARK_SERVER_TOKEN)
      : null;
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { fullName, email, company, employees, message } = body;

    // Validate required fields
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 },
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 },
      );
    }

    // Sanitize inputs (basic XSS prevention)
    const sanitize = (str: string) =>
      str?.replace(/[<>]/g, '').trim().slice(0, 1000);

    const sanitizedData = {
      fullName: sanitize(fullName),
      email: sanitize(email),
      company: sanitize(company || 'Not provided'),
      employees: sanitize(employees || 'Not provided'),
      message: sanitize(message),
    };

    // Prepare email content
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Name:</strong> ${sanitizedData.fullName}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${sanitizedData.email}</p>
          <p style="margin: 10px 0;"><strong>Company:</strong> ${sanitizedData.company}</p>
        </div>
        <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h3 style="color: #333; margin-top: 0;">Message:</h3>
          <p style="white-space: pre-wrap;">${sanitizedData.message}</p>
        </div>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 12px;">
          This email was sent from the contact form at siinc.io
        </p>
      </div>
    `;

    const textBody = `
New Contact Form Submission

Name: ${sanitizedData.fullName}
Email: ${sanitizedData.email}
Company: ${sanitizedData.company}

Message:
${sanitizedData.message}

---
This email was sent from the contact form at siinc.io
    `;

    // Check if client is available
    if (!client) {
      // In development/build without Postmark token, just log the message
      if (process.env.NODE_ENV === 'development') {
        // Development mode - just return success
        return NextResponse.json(
          { success: true, message: 'Email logged (development mode)' },
          { status: 200 },
        );
      }
      return NextResponse.json(
        { error: 'Email service not configured.' },
        { status: 503 },
      );
    }

    // Send email via Postmark
    await client.sendEmail({
      From: 'website@siinc.io', // You'll need to verify this sender in Postmark
      To: 'get@siinc.io',
      Subject: `Contact Form: ${sanitizedData.fullName} - ${sanitizedData.company}`,
      HtmlBody: htmlBody,
      TextBody: textBody,
      ReplyTo: sanitizedData.email,
      MessageStream: 'outbound',
    });

    // Return success response
    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 },
    );
  } catch (error) {
    // Check if it's a Postmark error
    if (error instanceof Error) {
      // Don't expose internal error details to client
      return NextResponse.json(
        {
          error:
            'Failed to send email. Please try again or contact us directly.',
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
}
