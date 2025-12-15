import { createClient, RedisClientType } from 'redis';
import axios from 'axios';

// Redis client singleton
let redisClient: RedisClientType | null = null;

async function getRedisClient(): Promise<RedisClientType> {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable not configured');
    }

    redisClient = createClient({ url: redisUrl });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    await redisClient.connect();
  }

  // Reconnect if disconnected
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
}

// KV keys for storing Xero data
const XERO_TOKENS_KEY = 'xero:tokens';
const XERO_TENANT_KEY = 'xero:tenant_id';

// Xero OAuth endpoints
const XERO_TOKEN_URL = 'https://identity.xero.com/connect/token';
const XERO_AUTHORIZE_URL = 'https://login.xero.com/identity/connect/authorize';
const XERO_CONNECTIONS_URL = 'https://api.xero.com/connections';

// All required scopes
const XERO_SCOPES = [
  'offline_access',
  'openid',
  'profile',
  'email',
  'accounting.transactions',
  'accounting.journals.read',
  'accounting.reports.read',
  'accounting.settings.read',
  'accounting.settings',
  'accounting.attachments',
  'accounting.attachments.read',
  'accounting.contacts',
  'accounting.contacts.read',
  'accounting.budgets.read',
  'payroll.payruns',
  'payroll.payslip',
  'payroll.settings',
  'payroll.employees',
  'payroll.timesheets',
  'files',
  'files.read',
  'assets',
  'assets.read',
  'projects',
  'projects.read',
];

export interface XeroTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix timestamp when access token expires
  id_token?: string;
  scope: string;
}

export interface XeroConnectionStatus {
  connected: boolean;
  expiresAt?: number;
  tenantId?: string | null;
}

// Server-side logger
function xeroLog(
  level: 'info' | 'warn' | 'error',
  message: string,
  data?: Record<string, unknown>,
) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    service: 'xero-oauth',
    message,
    ...data,
  };

  if (level === 'error') {
    console.error(JSON.stringify(logEntry));
  } else if (level === 'warn') {
    console.warn(JSON.stringify(logEntry));
  } else {
    console.log(JSON.stringify(logEntry));
  }
}

/**
 * Build the Xero authorization URL for OAuth flow
 */
export function buildAuthorizationUrl(state: string): string {
  const clientId = process.env.XERO_CLIENT_ID;
  const redirectUri = process.env.XERO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('XERO_CLIENT_ID and XERO_REDIRECT_URI must be configured');
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: XERO_SCOPES.join(' '),
    state: state,
  });

  return `${XERO_AUTHORIZE_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<XeroTokens> {
  const clientId = process.env.XERO_CLIENT_ID;
  const clientSecret = process.env.XERO_CLIENT_SECRET;
  const redirectUri = process.env.XERO_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Xero OAuth credentials not configured');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64',
  );

  xeroLog('info', 'Exchanging authorization code for tokens');

  try {
    const response = await axios.post(
      XERO_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }).toString(),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 30000,
      },
    );

    const { access_token, refresh_token, expires_in, id_token, scope } =
      response.data;

    xeroLog('info', 'Token exchange successful');

    return {
      access_token,
      refresh_token,
      expires_at: Date.now() + expires_in * 1000 - 60000, // Subtract 1 min buffer
      id_token,
      scope,
    };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: unknown };
      message?: string;
    };

    xeroLog('error', 'Token exchange failed', {
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      message: axiosError.message,
    });

    throw new Error('Failed to exchange authorization code');
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<XeroTokens> {
  const clientId = process.env.XERO_CLIENT_ID;
  const clientSecret = process.env.XERO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Xero OAuth credentials not configured');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64',
  );

  xeroLog('info', 'Refreshing access token');

  try {
    const response = await axios.post(
      XERO_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 30000,
      },
    );

    const { access_token, refresh_token, expires_in, id_token, scope } =
      response.data;

    xeroLog('info', 'Token refresh successful');

    return {
      access_token,
      refresh_token, // Xero uses rotating refresh tokens
      expires_at: Date.now() + expires_in * 1000 - 60000,
      id_token,
      scope,
    };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: unknown };
      message?: string;
    };

    xeroLog('error', 'Token refresh failed', {
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      message: axiosError.message,
    });

    throw new Error('Failed to refresh access token');
  }
}

/**
 * Store tokens in Redis
 */
export async function storeTokens(tokens: XeroTokens): Promise<void> {
  const redis = await getRedisClient();
  await redis.set(XERO_TOKENS_KEY, JSON.stringify(tokens));
  xeroLog('info', 'Tokens stored in Redis');
}

/**
 * Retrieve tokens from Redis
 */
export async function getStoredTokens(): Promise<XeroTokens | null> {
  const redis = await getRedisClient();
  const data = await redis.get(XERO_TOKENS_KEY);
  if (!data) return null;
  return JSON.parse(data);
}

/**
 * Delete tokens (disconnect)
 */
export async function deleteTokens(): Promise<void> {
  const redis = await getRedisClient();
  await redis.del(XERO_TOKENS_KEY);
  await redis.del(XERO_TENANT_KEY);
  xeroLog('info', 'Tokens deleted from Redis');
}

/**
 * Store tenant ID in Redis
 */
export async function storeTenantId(tenantId: string): Promise<void> {
  const redis = await getRedisClient();
  await redis.set(XERO_TENANT_KEY, tenantId);
  xeroLog('info', 'Tenant ID stored', { tenantId });
}

/**
 * Get tenant ID from Redis
 */
export async function getTenantId(): Promise<string | null> {
  const redis = await getRedisClient();
  return await redis.get(XERO_TENANT_KEY);
}

/**
 * Store OAuth state for CSRF protection (with 10-minute expiry)
 */
export async function storeOAuthState(state: string): Promise<void> {
  const redis = await getRedisClient();
  await redis.set(`xero:state:${state}`, 'pending', { EX: 600 });
}

/**
 * Verify and consume OAuth state
 */
export async function verifyOAuthState(state: string): Promise<boolean> {
  const redis = await getRedisClient();
  const storedState = await redis.get(`xero:state:${state}`);
  if (storedState) {
    await redis.del(`xero:state:${state}`);
    return true;
  }
  return false;
}

/**
 * Fetch tenant ID from Xero connections API
 */
export async function fetchTenantId(accessToken: string): Promise<string> {
  xeroLog('info', 'Fetching tenant ID from Xero');

  try {
    const response = await axios.get(XERO_CONNECTIONS_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    if (response.data && response.data.length > 0) {
      const tenantId = response.data[0].tenantId;
      xeroLog('info', 'Tenant ID fetched', { tenantId });
      return tenantId;
    }

    throw new Error('No Xero organizations connected');
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: unknown };
      message?: string;
    };

    xeroLog('error', 'Failed to fetch tenant ID', {
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      message: axiosError.message,
    });

    throw new Error('Failed to fetch Xero tenant ID');
  }
}

/**
 * Get a valid access token (refresh if needed)
 * This is the main function to use when making Xero API calls
 */
export async function getValidAccessToken(): Promise<string> {
  const tokens = await getStoredTokens();

  if (!tokens) {
    xeroLog('error', 'No Xero tokens found - not connected');
    throw new Error('Xero not connected. Please connect via admin panel.');
  }

  // Check if token is expired (or will expire within 1 minute)
  if (Date.now() >= tokens.expires_at) {
    xeroLog('info', 'Access token expired, refreshing');

    try {
      const newTokens = await refreshAccessToken(tokens.refresh_token);
      await storeTokens(newTokens);
      return newTokens.access_token;
    } catch {
      // If refresh fails, tokens may be invalid - delete them
      xeroLog('error', 'Token refresh failed, clearing stored tokens');
      await deleteTokens();
      throw new Error(
        'Xero token refresh failed. Please reconnect via admin panel.',
      );
    }
  }

  return tokens.access_token;
}

/**
 * Check if Xero is connected
 */
export async function isXeroConnected(): Promise<boolean> {
  const tokens = await getStoredTokens();
  return tokens !== null;
}

/**
 * Get connection status with details
 */
export async function getConnectionStatus(): Promise<XeroConnectionStatus> {
  const tokens = await getStoredTokens();
  const tenantId = await getTenantId();

  if (!tokens) {
    return { connected: false };
  }

  return {
    connected: true,
    expiresAt: tokens.expires_at,
    tenantId: tenantId,
  };
}
