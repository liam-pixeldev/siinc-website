import { NextRequest, NextResponse } from 'next/server';

import {
  getStoredTokens,
  refreshAccessToken,
  storeTokens,
  getTenantId,
} from '@/lib/xero';

export async function POST(request: NextRequest) {
  // Verify admin secret (from header or body)
  const body = await request.json().catch(() => ({}));
  const adminSecret =
    request.headers.get('x-admin-secret') || body.secret;

  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tokens = await getStoredTokens();

    if (!tokens) {
      return NextResponse.json(
        { error: 'No Xero connection found. Please connect first.' },
        { status: 400 },
      );
    }

    // Refresh the token
    const newTokens = await refreshAccessToken(tokens.refresh_token);
    await storeTokens(newTokens);

    const tenantId = await getTenantId();

    return NextResponse.json({
      success: true,
      connected: true,
      expiresAt: newTokens.expires_at,
      tenantId,
      scope: newTokens.scope,
    });
  } catch (error) {
    const err = error as { message?: string };
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        service: 'xero-oauth',
        message: 'Failed to refresh token',
        error: err.message,
      }),
    );

    return NextResponse.json(
      { error: 'Failed to refresh token. You may need to reconnect.' },
      { status: 500 },
    );
  }
}
