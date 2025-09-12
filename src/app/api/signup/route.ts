import { NextRequest, NextResponse } from 'next/server';

import axios from 'axios';

// Validate environment variables
function validateEnvironment(): { valid: boolean; error?: string } {
  const required = [
    'XERO_CUSTOM_CLIENT_ID',
    'XERO_CUSTOM_CLIENT_SECRET',
    'TENANT_ID',
    'SIINC_API_KEY',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    return {
      valid: false,
      error: `Missing required environment variables: ${missing.join(', ')}`,
    };
  }

  // SIINC_API_KEY validation removed - 'your-api-key-here' is acceptable

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

// Get Xero access token using client credentials
async function getXeroAccessToken(): Promise<string> {
  const clientId = process.env.XERO_CUSTOM_CLIENT_ID;
  const clientSecret = process.env.XERO_CUSTOM_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Xero credentials not configured');
  }

  const tokenUrl = 'https://identity.xero.com/connect/token';
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64',
  );

  try {
    // For Custom Connections, use client_credentials grant type
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('scope', 'accounting.contacts accounting.contacts.read');

    const response = await axios.post(tokenUrl, params.toString(), {
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Failed to get Xero access token:', error);
    }
    throw new Error('Xero authentication failed');
  }
}

// Search for existing contact in Xero by email
async function searchXeroContact(
  accessToken: string,
  email: string,
): Promise<string | null> {
  const tenantId = process.env.TENANT_ID;

  if (!tenantId) {
    throw new Error('Tenant ID not configured');
  }

  const xeroApiUrl = `https://api.xero.com/api.xro/2.0/Contacts?where=EmailAddress="${encodeURIComponent(email)}"`;

  try {
    const response = await axios.get(xeroApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'xero-tenant-id': tenantId,
        Accept: 'application/json',
      },
    });

    // Check if any contacts were found
    if (response.data.Contacts && response.data.Contacts.length > 0) {
      const existingContact = response.data.Contacts[0];
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(
          `Found existing Xero contact for ${email}: ${existingContact.ContactID}`,
        );
      }
      return existingContact.ContactID;
    }

    return null;
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: { Message?: string } };
    };

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(
        'Failed to search Xero contacts:',
        axiosError.response?.data || error,
      );
    }

    // If search fails, return null to proceed with creation
    return null;
  }
}

// Create contact in Xero
async function createXeroContact(
  accessToken: string,
  firstName: string,
  lastName: string,
  email: string,
  company?: string,
): Promise<string> {
  const tenantId = process.env.TENANT_ID;

  if (!tenantId) {
    throw new Error('Tenant ID not configured');
  }

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

    const response = await axios.post(xeroApiUrl, contactData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'xero-tenant-id': tenantId,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const xeroContact = response.data.Contacts[0];
    return xeroContact.ContactID;
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: { Message?: string } };
    };

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(
        'Failed to create Xero contact:',
        axiosError.response?.data || error,
      );
    }

    // Check for various Xero error scenarios
    if (axiosError.response?.status === 400) {
      const errorMessage = axiosError.response?.data?.Message || '';
      if (
        errorMessage.includes('already exists') ||
        errorMessage.includes('duplicate') ||
        errorMessage.includes('Email address is already in use')
      ) {
        // If contact already exists, try to search for it instead
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(
            'Contact already exists, will search for existing contact',
          );
        }
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

// Create user in Siinc backend
async function createSiincUser(
  xeroId: string,
  firstName: string,
  lastName: string,
  email: string,
  company?: string,
  plan?: string,
): Promise<void> {
  const siincApiKey = process.env.SIINC_API_KEY;

  if (!siincApiKey) {
    throw new Error('Siinc API key not configured');
  }

  const siincApiUrl = 'https://3.106.200.79/api/client/';

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

    const response = await axios.post(siincApiUrl, userData, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': siincApiKey,
      },
      timeout: 30000,
      validateStatus: (status) => status === 200 || status === 201,
      // In development, allow self-signed or mismatched certificates
      ...(process.env.NODE_ENV === 'development' && {
        httpsAgent: new (await import('https')).Agent({
          rejectUnauthorized: false,
        }),
      }),
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to create user');
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } };

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(
        'Failed to create Siinc user:',
        axiosError.response?.data || error,
      );
    }

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
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn(
          'Postmark not properly configured, skipping welcome email',
        );
      }
      return;
    }

    const postmark = await import('postmark');
    const client = new postmark.ServerClient(postmarkToken);

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 20px;">
          <h1 style="color: #333;">Welcome to Siinc!</h1>
        </div>
        <div style="background: #f5f5f5; padding: 30px; border-radius: 8px;">
          <p style="font-size: 16px; color: #333;">Hi ${firstName},</p>
          <p style="font-size: 16px; color: #666; line-height: 1.5;">
            Thank you for signing up for Siinc! Your account has been successfully created.
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
          <p>© 2024 Siinc. All rights reserved.</p>
        </div>
      </div>
    `;

    const textBody = `
Welcome to Siinc!

Hi ${firstName},

Thank you for signing up for Siinc! Your account has been successfully created.

You can now log in to your account and start protecting your Autodesk Construction Cloud data.

Log in at: https://siinc.io/login

If you have any questions, feel free to reach out to our support team at support@siinc.io.

Best regards,
The Siinc Team
    `;

    try {
      await client.sendEmail({
        From: 'website@siinc.io', // Same as contact form which works
        To: email,
        Subject: 'Welcome to Siinc - Your Account is Ready!',
        HtmlBody: htmlBody,
        TextBody: textBody,
        MessageStream: 'outbound',
      });

      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`Welcome email sent to ${email}`);
      }
    } catch (emailError) {
      const emailErr = emailError as {
        message?: string;
        code?: string;
        statusCode?: number;
      };
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('Failed to send welcome email:', {
          error: emailErr.message,
          code: emailErr.code,
          statusCode: emailErr.statusCode,
        });
      }
      // Don't throw - email is not critical to account creation
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Welcome email service error:', error);
    }
    // Don't throw - welcome email is not critical to account creation
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment configuration
    const envValidation = validateEnvironment();
    if (!envValidation.valid) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Environment validation failed:', envValidation.error);
      }
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

    try {
      // Step 1: Get Xero access token
      const accessToken = await getXeroAccessToken();

      // Step 2: Check if contact already exists in Xero
      let xeroId = await searchXeroContact(accessToken, sanitizedData.email);

      // Step 3: If no existing contact, create a new one
      if (!xeroId) {
        xeroId = await createXeroContact(
          accessToken,
          sanitizedData.firstName,
          sanitizedData.lastName,
          sanitizedData.email,
          sanitizedData.company,
        );
      }

      // Step 4: Create user in Siinc backend (including plan info)
      await createSiincUser(
        xeroId,
        sanitizedData.firstName,
        sanitizedData.lastName,
        sanitizedData.email,
        sanitizedData.company,
        sanitizedData.plan,
      );

      // Step 5: Send welcome email (optional - don't fail if email service is down)
      await sendWelcomeEmail(sanitizedData.firstName, sanitizedData.email);

      return NextResponse.json(
        {
          success: true,
          message:
            'Account created successfully! Check your email for next steps.',
        },
        { status: 200 },
      );
    } catch (error: unknown) {
      const errorObj = error as { message?: string };

      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Signup error:', error);
      }

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

      if (errorObj.message === 'Xero authentication failed') {
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
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Unexpected error:', error);
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 },
    );
  }
}
