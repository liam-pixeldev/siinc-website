import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Testimonials() {
  return (
    <section className="bg-mint py-16 md:py-28 lg:py-32">
      <div className="container">
        <div className="flex flex-col gap-3 md:flex-row">
          <h2 className="flex-1 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
            Trusted by
            <br />
            leading architectural, engineering & construction firms
          </h2>
          <div className="flex flex-1 flex-col items-start gap-3 md:max-w-md md:self-end">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              From ENR Top 100 contractors to specialized BIM consultancies,
              Siinc protects critical construction data for firms that can't
              afford downtime or data loss.
            </p>
            <Button
              asChild
              variant="outline"
              className="group border-border hover:border-primary/50 hover:bg-primary/5 focus-visible:ring-primary/30 focus-visible:ring-1 focus-visible:ring-offset-0"
            >
              <Link href="/contact">
                Schedule a demo
                <ArrowRight className="text-primary ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
