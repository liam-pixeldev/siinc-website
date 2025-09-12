'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestEmail() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const sendTestEmail = async () => {
    setLoading(true);
    setResult('Sending...');

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'liam@pixeldev.com.au',
          firstName: 'Liam',
        }),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      const err = error as Error;
      setResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Test Welcome Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={sendTestEmail} disabled={loading}>
            Send Test Email to liam@pixeldev.com.au
          </Button>

          {result && (
            <pre className="rounded bg-gray-100 p-4 text-sm">{result}</pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
