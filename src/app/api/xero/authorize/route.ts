import { NextRequest, NextResponse } from 'next/server';

import { buildAuthorizationUrl, storeOAuthState } from '@/lib/xero';

export async function GET(request: NextRequest) {
  // Verify admin secret
  const adminSecret = request.nextUrl.searchParams.get('secret');

  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Generate state for CSRF protection
    const state = crypto.randomUUID();

    // Store state in KV with 10-minute expiration
    await storeOAuthState(state);

    // Build and redirect to Xero authorization URL
    const authUrl = buildAuthorizationUrl(state);

    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'info',
        service: 'xero-oauth',
        message: 'Initiating OAuth flow',
        state,
      }),
    );

    return NextResponse.redirect(authUrl);
  } catch (error) {
    const err = error as { message?: string };
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        service: 'xero-oauth',
        message: 'Failed to initiate OAuth flow',
        error: err.message,
      }),
    );

    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 },
    );
  }
}
