import { NextRequest, NextResponse } from 'next/server';

import axios from 'axios';

import { getValidAccessToken, getTenantId } from '@/lib/xero';

// Server-side logger that always logs in production for Vercel
function serverLog(level: 'info' | 'warn' | 'error', message: string, data?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    service: 'signup-api',
    message,
    ...data,
  };

  // Always log to console - Vercel captures these in logs
  if (level === 'error') {
    console.error(JSON.stringify(logEntry));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(logEntry));
  } else {
    console.log(JSON.stringify(logEntry));
  }
}

// Validate environment variables
function validateEnvironment(): { valid: boolean; error?: string } {
  // Only check SIINC_API_KEY - Xero credentials are now managed via OAuth
  const required = ['SIINC_API_KEY'];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    serverLog('error', 'Environment validation failed', { missing });
    return {
      valid: false,
      error: `Missing required environment variables: ${missing.join(', ')}`,
    };
  }

  return { valid: true };
}

// Rate limiting: Simple in-memory store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + 60 * 60 * 1000, // 1 hour window
    });
    return true;
  }

  if (limit.count >= 10) {
    // Max 10 signups per hour per IP
    return false;
  }

  limit.count++;
  return true;
}

// Search for existing contact in Xero by email
async function searchXeroContact(
  accessToken: string,
  tenantId: string,
  email: string,
): Promise<string | null> {

  const xeroApiUrl = `https://api.xero.com/api.xro/2.0/Contacts?where=EmailAddress="${encodeURIComponent(email)}"`;

  try {
    const response = await axios.get(xeroApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'xero-tenant-id': tenantId,
        Accept: 'application/json',
      },
      timeout: 30000,
    });

    // Check if any contacts were found
    if (response.data.Contacts && response.data.Contacts.length > 0) {
      const existingContact = response.data.Contacts[0];
      serverLog('info', 'Found existing Xero contact', {
        email,
        contactId: existingContact.ContactID,
      });
      return existingContact.ContactID;
    }

    serverLog('info', 'No existing Xero contact found', { email });
    return null;
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: { Message?: string } };
      message?: string;
    };

    serverLog('warn', 'Failed to search Xero contacts', {
      email,
      status: axiosError.response?.status,
      responseData: axiosError.response?.data,
      errorMessage: axiosError.message,
    });

    // If search fails, return null to proceed with creation
    return null;
  }
}

// Create contact in Xero
async function createXeroContact(
  accessToken: string,
  tenantId: string,
  firstName: string,
  lastName: string,
  email: string,
  company?: string,
): Promise<string> {

  const xeroApiUrl = 'https://api.xero.com/api.xro/2.0/Contacts';

  try {
    const contactData = {
      Contacts: [
        {
          Name: company || `${firstName} ${lastName}`,
          FirstName: firstName,
          LastName: lastName,
          EmailAddress: email,
          ContactStatus: 'ACTIVE',
          IsCustomer: true,
          ContactPersons: [
            {
              FirstName: firstName,
              LastName: lastName,
              EmailAddress: email,
              IncludeInEmails: true,
            },
          ],
        },
      ],
    };

    serverLog('info', 'Creating Xero contact', { email, company });

    const response = await axios.post(xeroApiUrl, contactData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'xero-tenant-id': tenantId,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 30000,
    });

    const xeroContact = response.data.Contacts[0];
    serverLog('info', 'Xero contact created successfully', {
      email,
      contactId: xeroContact.ContactID,
    });
    return xeroContact.ContactID;
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: { Message?: string } };
      message?: string;
    };

    serverLog('error', 'Failed to create Xero contact', {
      email,
      status: axiosError.response?.status,
      responseData: axiosError.response?.data,
      errorMessage: axiosError.message,
    });

    // Check for various Xero error scenarios
    if (axiosError.response?.status === 400) {
      const errorMessage = axiosError.response?.data?.Message || '';
      if (
        errorMessage.includes('already exists') ||
        errorMessage.includes('duplicate') ||
        errorMessage.includes('Email address is already in use')
      ) {
        serverLog('info', 'Contact already exists, will search for existing contact', { email });
        throw new Error('Contact already exists in Xero');
      }
      throw new Error('Invalid contact data');
    }

    if (axiosError.response?.status === 401) {
      throw new Error('Xero authentication failed');
    }

    if (axiosError.response?.status === 403) {
      throw new Error('Insufficient permissions to create Xero contact');
    }

    throw new Error('Failed to create Xero contact');
  }
}

// Create user in SIINC backend
async function createSIINCUser(
  xeroId: string,
  firstName: string,
  lastName: string,
  email: string,
  company?: string,
  plan?: string,
): Promise<void> {
  const siincApiKey = process.env.SIINC_API_KEY;

  if (!siincApiKey) {
    serverLog('error', 'SIINC API key not configured');
    throw new Error('SIINC API key not configured');
  }

  const siincApiUrl = 'https://app.siinc.io/api/client/';

  try {
    const userData = {
      xero_id: xeroId,
      name: company || `${firstName} ${lastName}`,
      first_name: firstName,
      last_name: lastName,
      email: email,
      charge_rate: 0,
      plan: plan || 'standard',
    };

    serverLog('info', 'Creating SIINC user', { email, xeroId, plan: plan || 'standard' });

    // Create https agent to handle certificate issues with internal backend
    const https = await import('https');
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    const response = await axios.post(siincApiUrl, userData, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': siincApiKey,
      },
      timeout: 30000,
      validateStatus: (status) => status === 200 || status === 201,
      httpsAgent,
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to create user');
    }

    serverLog('info', 'SIINC user created successfully', { email, xeroId });
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: { message?: string } };
      message?: string;
      code?: string;
    };

    serverLog('error', 'Failed to create SIINC user', {
      email,
      xeroId,
      status: axiosError.response?.status,
      responseData: axiosError.response?.data,
      errorMessage: axiosError.message,
      errorCode: axiosError.code,
    });

    if (axiosError.response?.data?.message?.includes('already exists')) {
      throw new Error('User already exists');
    }

    throw new Error(
      axiosError.response?.data?.message || 'Failed to create user account',
    );
  }
}

// Send welcome email
async function sendWelcomeEmail(
  firstName: string,
  email: string,
): Promise<void> {
  try {
    // Check if Postmark token is configured and not a placeholder
    const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;

    if (!postmarkToken || postmarkToken.includes('your-token-here')) {
      serverLog('warn', 'Postmark not properly configured, skipping welcome email');
      return;
    }

    const postmark = await import('postmark');
    const client = new postmark.ServerClient(postmarkToken);

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px;">
          <h1 style="color: #333;">Welcome to SIINC!</h1>
        </div>
        <div style="background: #f5f5f5; padding: 30px; border-radius: 8px;">
          <p style="font-size: 16px; color: #333;">Hi ${firstName},</p>
          <p style="font-size: 16px; color: #666; line-height: 1.5;">
            Thank you for signing up for SIINC! Your account has been successfully created.
          </p>
          <p style="font-size: 16px; color: #666; line-height: 1.5;">
            You can now log in to your account and start protecting your Autodesk Construction Cloud data.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://app.siinc.io"
               style="display: inline-block; padding: 12px 30px; background: #000; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Log In to Your Account
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">
            If you have any questions, feel free to reach out to our support team at support@siinc.io.
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© 2024 SIINC. All rights reserved.</p>
        </div>
      </div>
    `;

    const textBody = `
Welcome to SIINC!

Hi ${firstName},

Thank you for signing up for SIINC! Your account has been successfully created.

You can now log in to your account and start protecting your Autodesk Construction Cloud data.

Log in at: https://siinc.io/login

If you have any questions, feel free to reach out to our support team at support@siinc.io.

Best regards,
The SIINC Team
    `;

    try {
      await client.sendEmail({
        From: 'website@siinc.io', // Same as contact form which works
        To: email,
        Subject: 'Welcome to SIINC - Your Account is Ready!',
        HtmlBody: htmlBody,
        TextBody: textBody,
        MessageStream: 'outbound',
      });

      serverLog('info', 'Welcome email sent', { email });
    } catch (emailError) {
      const emailErr = emailError as {
        message?: string;
        code?: string;
        statusCode?: number;
      };
      serverLog('warn', 'Failed to send welcome email', {
        email,
        error: emailErr.message,
        code: emailErr.code,
        statusCode: emailErr.statusCode,
      });
      // Don't throw - email is not critical to account creation
    }
  } catch (error) {
    const err = error as { message?: string };
    serverLog('error', 'Welcome email service error', { error: err.message });
    // Don't throw - welcome email is not critical to account creation
  }
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID().slice(0, 8);

  try {
    serverLog('info', 'Signup request received', { requestId });

    // Validate environment configuration
    const envValidation = validateEnvironment();
    if (!envValidation.valid) {
      return NextResponse.json(
        { error: 'Service configuration error. Please contact support.' },
        { status: 503 },
      );
    }

    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      serverLog('warn', 'Rate limit exceeded', { requestId, ip });
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { firstName, lastName, email, company, plan } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      serverLog('warn', 'Missing required fields', { requestId, hasFirstName: !!firstName, hasLastName: !!lastName, hasEmail: !!email });
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 },
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      serverLog('warn', 'Invalid email format', { requestId, email });
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 },
      );
    }

    // Sanitize inputs
    const sanitize = (str: string) =>
      str?.replace(/[<>]/g, '').trim().slice(0, 500);

    const sanitizedData = {
      firstName: sanitize(firstName),
      lastName: sanitize(lastName),
      email: sanitize(email).toLowerCase(),
      company: company ? sanitize(company) : undefined,
      plan: plan || 'standard',
    };

    serverLog('info', 'Processing signup', { requestId, email: sanitizedData.email, plan: sanitizedData.plan });

    try {
      // Step 1: Get Xero access token (uses OAuth tokens with auto-refresh)
      const accessToken = await getValidAccessToken();

      // Step 2: Get tenant ID from stored OAuth connection
      const tenantId = await getTenantId();
      if (!tenantId) {
        serverLog('error', 'Xero tenant ID not found - Xero not connected', { requestId });
        throw new Error('Xero not connected');
      }

      // Step 3: Check if contact already exists in Xero
      let xeroId = await searchXeroContact(accessToken, tenantId, sanitizedData.email);

      // Step 4: If no existing contact, create a new one
      if (!xeroId) {
        xeroId = await createXeroContact(
          accessToken,
          tenantId,
          sanitizedData.firstName,
          sanitizedData.lastName,
          sanitizedData.email,
          sanitizedData.company,
        );
      }

      // Step 5: Create user in SIINC backend (including plan info)
      await createSIINCUser(
        xeroId,
        sanitizedData.firstName,
        sanitizedData.lastName,
        sanitizedData.email,
        sanitizedData.company,
        sanitizedData.plan,
      );

      // Step 5: Send welcome email (optional - don't fail if email service is down)
      await sendWelcomeEmail(sanitizedData.firstName, sanitizedData.email);

      serverLog('info', 'Signup completed successfully', { requestId, email: sanitizedData.email, xeroId });

      return NextResponse.json(
        {
          success: true,
          message:
            'Account created successfully! Check your email for next steps.',
        },
        { status: 200 },
      );
    } catch (error: unknown) {
      const errorObj = error as { message?: string; stack?: string };

      serverLog('error', 'Signup processing error', {
        requestId,
        email: sanitizedData.email,
        errorMessage: errorObj.message,
        errorStack: errorObj.stack,
      });

      // Handle specific error messages
      if (
        errorObj.message === 'User already exists' ||
        errorObj.message === 'Contact already exists in Xero'
      ) {
        return NextResponse.json(
          {
            error:
              'An account with this email already exists. Please try logging in.',
          },
          { status: 409 },
        );
      }

      if (
        errorObj.message === 'Xero authentication failed' ||
        errorObj.message === 'Xero not connected' ||
        errorObj.message?.includes('not connected') ||
        errorObj.message?.includes('refresh failed')
      ) {
        return NextResponse.json(
          {
            error:
              'Authentication service is temporarily unavailable. Please try again later.',
          },
          { status: 503 },
        );
      }

      return NextResponse.json(
        {
          error:
            errorObj.message || 'Failed to create account. Please try again.',
        },
        { status: 500 },
      );
    }
  } catch (error) {
    const err = error as { message?: string; stack?: string };
    serverLog('error', 'Unexpected error in signup handler', {
      requestId,
      errorMessage: err.message,
      errorStack: err.stack,
    });
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 },
    );
  }
}
