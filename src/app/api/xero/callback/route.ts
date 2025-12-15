import { NextRequest, NextResponse } from 'next/server';

import {
  exchangeCodeForTokens,
  fetchTenantId,
  storeTokens,
  storeTenantId,
  verifyOAuthState,
} from '@/lib/xero';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://siinc.io';

  // Handle error from Xero
  if (error) {
    const errorDescription = searchParams.get('error_description');
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        service: 'xero-oauth',
        message: 'OAuth error from Xero',
        error,
        errorDescription,
      }),
    );

    return NextResponse.redirect(
      new URL(`/admin/xero?error=${encodeURIComponent(error)}`, baseUrl),
    );
  }

  // Validate required parameters
  if (!code || !state) {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        service: 'xero-oauth',
        message: 'Missing code or state parameter',
        hasCode: !!code,
        hasState: !!state,
      }),
    );

    return NextResponse.redirect(
      new URL('/admin/xero?error=missing_parameters', baseUrl),
    );
  }

  // Verify state (CSRF protection)
  const isValidState = await verifyOAuthState(state);
  if (!isValidState) {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        service: 'xero-oauth',
        message: 'Invalid or expired state',
        state,
      }),
    );

    return NextResponse.redirect(
      new URL('/admin/xero?error=invalid_state', baseUrl),
    );
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Store tokens
    await storeTokens(tokens);

    // Fetch and store tenant ID
    const tenantId = await fetchTenantId(tokens.access_token);
    await storeTenantId(tenantId);

    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'info',
        service: 'xero-oauth',
        message: 'OAuth flow completed successfully',
        tenantId,
      }),
    );

    return NextResponse.redirect(
      new URL('/admin/xero?success=connected', baseUrl),
    );
  } catch (err) {
    const error = err as { message?: string };
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        service: 'xero-oauth',
        message: 'Token exchange failed',
        error: error.message,
      }),
    );

    return NextResponse.redirect(
      new URL('/admin/xero?error=token_exchange_failed', baseUrl),
    );
  }
}
