'use client';

import { useState } from 'react';

import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    monthlyPrice: 'From $299',
    annualPrice: 'From $2,990',
    features: [
      'Up to 100GB storage',
      'Daily incremental backups',
      'File-level restore',
      'Email support',
    ],
    cta: 'Start free trial',
  },
  {
    name: 'Professional',
    monthlyPrice: 'Per GB',
    annualPrice: 'Per GB/year',
    monthlyPerUnit: 'Usage-based pricing',
    annualPerUnit: 'Volume discounts available',
    features: [
      'Unlimited storage (pay per GB)',
      'Hourly incremental backups',
      'Granular restore (file/folder/project)',
      'Compliance reports & audit logs',
      'BYO storage (Azure/AWS/S3)',
      '24×7 priority support',
    ],
    cta: 'Get instant quote',
    popular: true,
  },
  {
    name: 'Enterprise',
    monthlyPrice: 'Custom',
    annualPrice: 'Custom',
    monthlyPerUnit: 'Contact sales',
    annualPerUnit: 'Volume licensing',
    features: [
      'All Professional features',
      'Custom backup schedules',
      'Dedicated support team',
      'SLA guarantees',
      'Custom integrations',
      'On-premises deployment option',
    ],
    cta: 'Contact sales',
  },
];

export default function Pricing({
  headerTag = 'h2',
}: {
  headerTag?: 'h1' | 'h2';
}) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="py-16 md:py-28 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          {headerTag === 'h1' ? (
            <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Simple, transparent pricing
            </h1>
          ) : (
            <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Simple, transparent pricing
            </h2>
          )}
          <p className="text-muted-foreground text-lg text-balance">
            Start with a 30-day free trial. No credit card required.
            Scale up or down based on your storage needs with transparent
            per-GB pricing.
          </p>
          <div className="inline-flex items-center gap-2">
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              aria-label="Toggle annual billing"
            />
            <span className="text-sm font-medium">Billed annually</span>
          </div>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 md:mt-12 lg:mt-20 lg:grid-cols-3">
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
                  plan.popular && 'bg-background relative ring-2 ring-accent shadow-accent/20 shadow-lg',
                )}
              >
                <CardHeader>
                  <h3 className="text-2xl font-semibold">{plan.name}</h3>
                  <div className="mt-2">
                    <p className="text-muted-foreground text-lg font-medium">
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      {(plan.monthlyPerUnit || plan.annualPerUnit) &&
                        ' ' +
                          (isAnnual ? plan.annualPerUnit : plan.monthlyPerUnit)}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col space-y-6">
                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    className={plan.popular ? 'bg-accent hover:bg-accent/90' : ''}
                  >
                    {plan.cta}
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
