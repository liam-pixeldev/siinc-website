import React from 'react';

import type { Metadata } from 'next';

import Contact from '@/components/sections/contact';

export const metadata: Metadata = {
  title: 'Contact Us - Get Started with Siinc',
  description:
    'Contact Siinc for a demo or to learn more about our ACC backup solution. Global offices in Sydney, New York, London, and Singapore. Get expert support.',
  openGraph: {
    title: 'Contact Siinc - Schedule Your ACC Backup Demo',
    description:
      'Get in touch with our team to learn how Siinc can protect your ACC data. Schedule a demo today.',
  },
};

const page = () => {
  return <Contact />;
};

export default page;
