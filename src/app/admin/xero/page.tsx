'use client';

import { useState, useEffect, Suspense } from 'react';

import { useSearchParams } from 'next/navigation';

import {
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Link2,
  Unlink,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ConnectionStatus {
  connected: boolean;
  expiresAt?: number;
  tenantId?: string;
}

function XeroAdminContent() {
  const searchParams = useSearchParams();

  const [adminSecret, setAdminSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Check URL params for messages
  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'connected') {
      setMessage({ type: 'success', text: 'Successfully connected to Xero!' });
    } else if (error) {
      const errorMessages: Record<string, string> = {
        missing_parameters: 'Missing parameters in callback',
        invalid_state: 'Invalid or expired state - please try again',
        token_exchange_failed: 'Failed to exchange token - please try again',
        access_denied: 'Access was denied by user',
      };
      setMessage({
        type: 'error',
        text: errorMessages[error] || `Connection failed: ${error}`,
      });
    }
  }, [searchParams]);

  // Fetch status when authenticated
  const fetchStatus = async () => {
    if (!adminSecret) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/xero/status?secret=${encodeURIComponent(adminSecret)}`,
      );

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        setMessage({ type: 'error', text: 'Invalid admin secret' });
        setIsAuthenticated(false);
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch status' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to connect to server' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = () => {
    window.location.href = `/api/xero/authorize?secret=${encodeURIComponent(adminSecret)}`;
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/xero/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: adminSecret }),
      });

      if (response.ok) {
        setStatus({ connected: false });
        setMessage({
          type: 'success',
          text: 'Successfully disconnected from Xero',
        });
      } else {
        setMessage({ type: 'error', text: 'Failed to disconnect' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to disconnect' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && adminSecret) {
      fetchStatus();
    }
  };

  return (
    <section className="bg-sand-100 min-h-screen py-16 md:py-28">
      <div className="container max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Xero Connection Management</CardTitle>
            <CardDescription>
              Manage the Xero OAuth connection for signup integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isAuthenticated ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="adminSecret">Admin Secret</Label>
                  <Input
                    id="adminSecret"
                    type="password"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter admin secret"
                  />
                </div>
                <Button
                  onClick={fetchStatus}
                  disabled={isLoading || !adminSecret}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Authenticate
                </Button>
              </div>
            ) : (
              <>
                {/* Connection Status */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    {status?.connected ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">
                        {status?.connected
                          ? 'Connected to Xero'
                          : 'Not Connected'}
                      </p>
                      {status?.connected && status.tenantId && (
                        <p className="text-muted-foreground text-sm">
                          Tenant ID: {status.tenantId}
                        </p>
                      )}
                      {status?.connected && status.expiresAt && (
                        <p className="text-muted-foreground text-sm">
                          Token expires:{' '}
                          {new Date(status.expiresAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {status?.connected ? (
                    <>
                      <Button variant="outline" onClick={handleConnect}>
                        <Link2 className="mr-2 h-4 w-4" />
                        Reconnect
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDisconnect}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Unlink className="mr-2 h-4 w-4" />
                        )}
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleConnect}>
                      <Link2 className="mr-2 h-4 w-4" />
                      Connect to Xero
                    </Button>
                  )}
                </div>

                {/* Refresh Status Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchStatus}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Refresh Status
                </Button>
              </>
            )}

            {/* Messages */}
            {message && (
              <div
                className={`flex items-center gap-2 rounded-md border p-3 ${
                  message.type === 'success'
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <p
                  className={`text-sm ${
                    message.type === 'success'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default function XeroAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <XeroAdminContent />
    </Suspense>
  );
}
