import React from 'react';

import type { Metadata } from 'next';

import { FAQ } from '@/components/sections/faq';
import Pricing from '@/components/sections/pricing';
import Pricing2 from '@/components/sections/pricing2';

export const metadata: Metadata = {
  title: 'Pricing - Transparent Per-GB Pricing',
  description:
    'Simple, transparent pricing for ACC backup. From $1.10 to $1.50 per GB per month. No hidden fees. 30-day free trial. Enterprise volume discounts available.',
  openGraph: {
    title: 'Siinc Pricing - ACC Backup from $1.10/GB/Month',
    description:
      'Simple, transparent pricing for ACC backup. No hidden fees. 30-day free trial. Enterprise volume discounts available.',
  },
};

const page = () => {
  return (
    <>
      <Pricing headerTag="h1" />
      <Pricing2 />
      <FAQ />
    </>
  );
};

export default page;
