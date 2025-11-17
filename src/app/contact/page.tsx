import React from 'react';

import type { Metadata } from 'next';

import Contact from '@/components/sections/contact';

export const metadata: Metadata = {
  title: 'Contact Us - Get Started with SIINC',
  description:
    'Contact SIINC for a demo or to learn more about our ACC backup solution. Global offices in Sydney, New York, London, and Singapore. Get expert support.',
  openGraph: {
    title: 'Contact SIINC - Schedule Your ACC Backup Demo',
    description:
      'Get in touch with our team to learn how SIINC can protect your ACC data. Schedule a demo today.',
  },
};

const page = () => {
  return <Contact />;
};

export default page;
