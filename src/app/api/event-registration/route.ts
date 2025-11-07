import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import * as postmark from 'postmark';

// Rate limiting (simple in-memory implementation)
const registrationAttempts = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 5; // registrations per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

// Validation schema
const eventRegistrationSchema = z.object({
  event: z.string().min(1, 'Event is required'),
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  cellPhone: z.string().min(1, 'Cell phone is required'),
  company: z.string().max(100).optional(),
  jobTitle: z.string().max(100).optional(),
  dietaryRequirements: z.string().max(500).optional(),
});

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '');
}

// Check rate limit
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = registrationAttempts.get(ip);

  if (!attempt || now > attempt.resetTime) {
    registrationAttempts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (attempt.count >= RATE_LIMIT) {
    return false;
  }

  attempt.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = eventRegistrationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Sanitize all string inputs
    const sanitizedData = {
      event: sanitizeInput(data.event),
      name: sanitizeInput(data.name),
      email: sanitizeInput(data.email),
      cellPhone: sanitizeInput(data.cellPhone),
      company: data.company ? sanitizeInput(data.company) : 'Not provided',
      jobTitle: data.jobTitle ? sanitizeInput(data.jobTitle) : 'Not provided',
      dietaryRequirements: data.dietaryRequirements ? sanitizeInput(data.dietaryRequirements) : 'None',
    };

    // Send email via Postmark
    const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;

    if (!postmarkToken) {
      console.error('POSTMARK_SERVER_TOKEN is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    const client = new postmark.ServerClient(postmarkToken);

    // Create email content
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #1a1a1a;
              font-size: 24px;
            }
            .content {
              background-color: #ffffff;
              padding: 20px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
            }
            .field {
              margin-bottom: 15px;
            }
            .field-label {
              font-weight: 600;
              color: #6b7280;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .field-value {
              margin-top: 4px;
              color: #1a1a1a;
              font-size: 16px;
            }
            .divider {
              height: 1px;
              background-color: #e5e7eb;
              margin: 20px 0;
            }
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>New Event Registration</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="field-label">Event</div>
              <div class="field-value">${sanitizedData.event}</div>
            </div>
            <div class="divider"></div>
            <div class="field">
              <div class="field-label">Name</div>
              <div class="field-value">${sanitizedData.name}</div>
            </div>
            <div class="field">
              <div class="field-label">Email Address</div>
              <div class="field-value"><a href="mailto:${sanitizedData.email}">${sanitizedData.email}</a></div>
            </div>
            <div class="field">
              <div class="field-label">Cell Phone</div>
              <div class="field-value"><a href="tel:${sanitizedData.cellPhone}">${sanitizedData.cellPhone}</a></div>
            </div>
            <div class="divider"></div>
            <div class="field">
              <div class="field-label">Company</div>
              <div class="field-value">${sanitizedData.company}</div>
            </div>
            <div class="field">
              <div class="field-label">Job Title</div>
              <div class="field-value">${sanitizedData.jobTitle}</div>
            </div>
            <div class="divider"></div>
            <div class="field">
              <div class="field-label">Dietary Requirements</div>
              <div class="field-value">${sanitizedData.dietaryRequirements}</div>
            </div>
          </div>
          <div class="footer">
            <p>This registration was submitted from the Siinc website event registration form.</p>
            <p>IP Address: ${ip}</p>
            <p>Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'short' })}</p>
          </div>
        </body>
      </html>
    `;

    const textBody = `
New Event Registration

Event: ${sanitizedData.event}

Contact Information:
- Name: ${sanitizedData.name}
- Email: ${sanitizedData.email}
- Cell Phone: ${sanitizedData.cellPhone}

Professional Information:
- Company: ${sanitizedData.company}
- Job Title: ${sanitizedData.jobTitle}

Special Requirements:
- Dietary Requirements: ${sanitizedData.dietaryRequirements}

---
Submitted from: Siinc Website Event Registration
IP Address: ${ip}
Timestamp: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: 'short' })}
    `.trim();

    // Send email
    await client.sendEmail({
      From: 'website@siinc.io',
      To: 'events@siinc.io',
      Subject: `Event Registration: ${sanitizedData.event} - ${sanitizedData.name}`,
      HtmlBody: htmlBody,
      TextBody: textBody,
      MessageStream: 'outbound',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Event registration error:', error);

    return NextResponse.json(
      {
        error: 'An error occurred while processing your registration. Please try again later.'
      },
      { status: 500 }
    );
  }
}
