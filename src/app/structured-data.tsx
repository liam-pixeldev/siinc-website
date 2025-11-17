export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SINC LLC',
  alternateName: 'SIINC',
  url: 'https://siinc.io',
  logo: 'https://siinc.io/logo.png',
  description:
    'Enterprise-grade backup and recovery solution for Common Data Environments including Autodesk Construction Cloud, BIM 360, and Autodesk Build.',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+61-2-XXXX-XXXX',
      contactType: 'sales',
      areaServed: 'AU',
      availableLanguage: ['en'],
    },
    {
      '@type': 'ContactPoint',
      email: 'get@siinc.io',
      contactType: 'customer support',
      areaServed: 'Worldwide',
      availableLanguage: ['en'],
    },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Level 35, Tower One Barangaroo, 100 Barangaroo Avenue',
    addressLocality: 'Sydney',
    addressRegion: 'NSW',
    postalCode: '2000',
    addressCountry: 'AU',
  },
  sameAs: [
    'https://www.linkedin.com/company/siinc',
    'https://twitter.com/siinc_io',
  ],
};

export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SIINC',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150',
  },
  featureList: [
    'Automated backups for CDEs',
    'Granular restore capabilities',
    'Compliance reporting',
    'Enterprise-grade security',
    'BYO storage options',
    '24/7 support',
  ],
  screenshot: 'https://siinc.io/screenshot.png',
  softwareHelp: 'https://siinc.io/faq',
  softwareVersion: '2.0',
  releaseNotes: 'https://siinc.io/changelog',
};

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does SIINC backup Common Data Environment data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SIINC uses OAuth 2.0 to securely connect to your CDE and performs automated incremental backups of your projects, storing them encrypted in your chosen storage location.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is SIINC compliant with data protection regulations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, SIINC is compliant with GDPR, CCPA, Australian Privacy Act, and other major data protection regulations. We provide compliance reports and audit logs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the pricing for SIINC?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SIINC offers flexible pricing plans tailored to your specific needs. Contact us for detailed pricing information based on your storage requirements and desired features.',
      },
    },
  ],
};
