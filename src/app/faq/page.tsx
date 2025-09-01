import React from 'react';

import type { Metadata } from 'next';

import { FAQPage } from '@/components/sections/faq-page';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description:
    'Common questions about Siinc ACC backup: How it works, security, compliance, pricing, setup, and more. Get answers about protecting your construction data.',
  openGraph: {
    title: 'Siinc FAQ - ACC Backup Questions Answered',
    description:
      'Everything you need to know about Siinc: ACC backup, security, compliance, pricing, and setup.',
  },
};

const page = () => {
  return <FAQPage />;
};

export default page;
