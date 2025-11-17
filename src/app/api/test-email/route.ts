import { NextRequest, NextResponse } from 'next/server';

// Test endpoint to send welcome email without creating accounts
export async function POST(request: NextRequest) {
  try {
    const postmark = await import('postmark');
    const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;

    // Debug logging removed for production

    if (!postmarkToken || postmarkToken.includes('your-token-here')) {
      return NextResponse.json(
        { error: 'Postmark not configured', tokenExists: !!postmarkToken },
        { status: 503 },
      );
    }

    const client = new postmark.ServerClient(postmarkToken);

    const body = await request.json();
    const { email, firstName } = body;

    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Email and firstName required' },
        { status: 400 },
      );
    }

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

Log in at: https://app.siinc.io

If you have any questions, feel free to reach out to our support team at support@siinc.io.

Best regards,
The SIINC Team
    `;

    const result = await client.sendEmail({
      From: 'website@siinc.io',
      To: email,
      Subject: 'Welcome to SIINC - Your Account is Ready!',
      HtmlBody: htmlBody,
      TextBody: textBody,
      MessageStream: 'outbound',
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.MessageID,
    });
  } catch (error) {
    const err = error as { message?: string; code?: string };
    return NextResponse.json(
      {
        error: 'Failed to send test email',
        details: err.message,
        code: err.code,
      },
      { status: 500 },
    );
  }
}
