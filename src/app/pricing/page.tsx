import React from 'react';

import type { Metadata } from 'next';

import { FAQ } from '@/components/sections/faq';
import Pricing from '@/components/sections/pricing';

export const metadata: Metadata = {
  title: 'Pricing - Flexible Plans for Your Needs',
  description:
    'Flexible pricing plans for ACC backup. Contact us for detailed pricing information tailored to your requirements. Multiple plan options available.',
  openGraph: {
    title: 'SIINC Pricing - Flexible ACC Backup Plans',
    description:
      'Flexible pricing plans for ACC backup. Contact us for detailed pricing information tailored to your requirements.',
  },
};

const page = () => {
  return (
    <>
      <Pricing headerTag="h1" />
      <FAQ />
    </>
  );
};

export default page;
