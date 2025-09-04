export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Siinc Pty Ltd',
  alternateName: 'Siinc',
  url: 'https://siinc.io',
  logo: 'https://siinc.io/logo.png',
  description:
    'Enterprise-grade backup and recovery solution for Autodesk Construction Cloud, BIM 360, and Autodesk Build.',
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
  name: 'Siinc',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '1.50',
    priceCurrency: 'USD',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '1.50',
      priceCurrency: 'USD',
      unitText: 'GB per month',
      billingDuration: 'P1M',
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '150',
  },
  featureList: [
    'Automated backups for ACC',
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
      name: 'How does Siinc backup Autodesk Construction Cloud data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Siinc uses OAuth 2.0 to securely connect to your ACC account and performs automated incremental backups of your projects, storing them encrypted in your chosen storage location.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Siinc compliant with data protection regulations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Siinc is compliant with GDPR, CCPA, Australian Privacy Act, and other major data protection regulations. We provide compliance reports and audit logs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the pricing for Siinc?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Siinc offers transparent per-GB pricing from $1.10 to $1.50 per GB per month, with volume discounts available for enterprise customers.',
      },
    },
  ],
};
