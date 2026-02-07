import { createClient } from 'redis';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return NextResponse.json(
      { error: 'REDIS_URL not configured' },
      { status: 500 },
    );
  }

  let client;
  try {
    client = createClient({ url: redisUrl });
    await client.connect();

    const timestamp = new Date().toISOString();
    await client.set('keepalive:ping', timestamp);

    console.log(`[cron/keepalive] Pinged Redis at ${timestamp}`);

    return NextResponse.json({ ok: true, timestamp });
  } catch (error) {
    console.error('[cron/keepalive] Failed to ping Redis:', error);
    return NextResponse.json(
      { error: 'Failed to ping Redis' },
      { status: 500 },
    );
  } finally {
    if (client?.isOpen) {
      await client.disconnect();
    }
  }
}
