'use client';

import Link from 'next/link';

import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Basic',
    id: 'basic',
    features: [
      'Daily incremental backups',
      'File-level restore',
      'Email support',
    ],
    cta: 'Get started',
  },
  {
    name: 'Standard',
    id: 'standard',
    features: [
      'Hourly incremental backups',
      'Granular restore (file/folder/project)',
      'Compliance reports & audit logs',
      'BYO storage (Azure/AWS/S3)',
      'Email + priority support',
    ],
    cta: 'Get started',
    popular: true,
  },
  {
    name: 'Professional',
    id: 'professional',
    features: [
      'Hourly incremental backups',
      'Granular restore (file/folder/project)',
      'Compliance reports & audit logs',
      'BYO storage (Azure/AWS/S3)',
      '24×7 priority support',
    ],
    cta: 'Get started',
  },
  {
    name: 'Enterprise',
    id: 'enterprise',
    features: [
      'All Professional features',
      'Custom backup schedules',
      'Dedicated support team',
      'SLA guarantees',
      'Custom integrations',
      'On-premises deployment option',
    ],
    cta: 'Get started',
  },
];

export default function Pricing({
  headerTag = 'h2',
}: {
  headerTag?: 'h1' | 'h2';
}) {
  return (
    <section className="py-16 md:py-28 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          {headerTag === 'h1' ? (
            <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Flexible pricing plans
            </h1>
          ) : (
            <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Flexible pricing plans
            </h2>
          )}
          <p className="text-muted-foreground text-lg text-balance">
            Choose the plan that best fits your needs. Contact us for detailed
            pricing information tailored to your requirements.
          </p>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 md:mt-12 lg:mt-20 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                plan.popular &&
                  'from-mint/70 to-sand-100 scale-[1.075] rounded-3xl bg-linear-to-b p-3',
              )}
            >
              <Card
                className={cn(
                  'h-full border-none bg-zinc-100 dark:bg-zinc-900',
                  plan.popular &&
                    'bg-background ring-accent shadow-accent/20 relative shadow-lg ring-2',
                )}
              >
                <CardHeader>
                  <h3 className="text-2xl font-semibold">{plan.name}</h3>
                </CardHeader>
                <CardContent className="flex flex-col space-y-6">
                  <Button
                    asChild
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    className={
                      plan.popular ? 'bg-accent hover:bg-accent/90' : ''
                    }
                  >
                    <Link href={`/signup?plan=${plan.id}`}>Get started</Link>
                  </Button>

                  <div className="space-y-4">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <Check className="size-4 shrink-0" />
                        <span className="text-muted-foreground text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
