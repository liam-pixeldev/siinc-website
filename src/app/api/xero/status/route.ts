import { NextRequest, NextResponse } from 'next/server';

import { getConnectionStatus } from '@/lib/xero';

export async function GET(request: NextRequest) {
  // Verify admin secret (from header or query)
  const adminSecret =
    request.headers.get('x-admin-secret') ||
    request.nextUrl.searchParams.get('secret');

  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const status = await getConnectionStatus();
    return NextResponse.json(status);
  } catch (error) {
    const err = error as { message?: string };
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        service: 'xero-oauth',
        message: 'Failed to get connection status',
        error: err.message,
      }),
    );

    return NextResponse.json(
      { error: 'Failed to get connection status' },
      { status: 500 },
    );
  }
}
