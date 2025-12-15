import { NextRequest, NextResponse } from 'next/server';

import { deleteTokens } from '@/lib/xero';

export async function POST(request: NextRequest) {
  try {
    // Verify admin secret
    const body = await request.json();

    if (!body.secret || body.secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await deleteTokens();

    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'info',
        service: 'xero-oauth',
        message: 'Xero disconnected successfully',
      }),
    );

    return NextResponse.json({ success: true, message: 'Xero disconnected' });
  } catch (error) {
    const err = error as { message?: string };
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'error',
        service: 'xero-oauth',
        message: 'Failed to disconnect',
        error: err.message,
      }),
    );

    return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 });
  }
}
