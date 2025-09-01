import { Inter, Inter_Tight } from 'next/font/google';

import type { Metadata } from 'next';

import GoogleAnalytics from './google-analytics';
import {
  organizationSchema,
  softwareApplicationSchema,
} from './structured-data';

import { Footer } from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://siinc.io'),
  title: {
    default: 'Siinc - Enterprise Backup for Autodesk Construction Cloud',
    template: '%s | Siinc',
  },
  description:
    'Enterprise-grade backup and recovery for ACC, BIM 360 & Autodesk Build. Protect construction data with automated backups, instant restore, and compliance-ready reporting.',
  keywords: [
    'Autodesk Construction Cloud backup',
    'ACC backup',
    'BIM 360 backup',
    'Autodesk Build backup',
    'construction data protection',
    'ACC data recovery',
    'construction project backup',
    'BIM backup solution',
    'construction compliance',
    'project archival',
    'construction data resilience',
    'AEC backup solution',
  ],
  authors: [{ name: 'Siinc', url: 'https://siinc.io' }],
  creator: 'Siinc Pty Ltd',
  publisher: 'Siinc Pty Ltd',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#10b981',
      },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://siinc.io',
    title: 'Siinc - Enterprise Backup for Autodesk Construction Cloud',
    description:
      'Enterprise-grade backup and recovery for ACC, BIM 360 & Autodesk Build. Protect construction data with automated backups, instant restore, and compliance-ready reporting.',
    siteName: 'Siinc',
    images: [
      {
        url: 'https://siinc.io/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Siinc - Enterprise Backup for Autodesk Construction Cloud',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Siinc - Enterprise Backup for Autodesk Construction Cloud',
    description:
      'Enterprise-grade backup and recovery for ACC, BIM 360 & Autodesk Build. Protect your construction data.',
    site: '@siinc_io',
    creator: '@siinc_io',
    images: ['https://siinc.io/og-image.png'],
  },
  alternates: {
    canonical: 'https://siinc.io',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    other: {
      'msvalidate.01': 'bing-verification-code',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareApplicationSchema),
          }}
        />
      </head>
      <body
        className={`h-screen ${inter.variable} ${interTight.variable} antialiased`}
      >
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
