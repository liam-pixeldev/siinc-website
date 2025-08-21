import { Inter, Inter_Tight } from 'next/font/google';

import type { Metadata } from 'next';

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
  title: {
    default: 'Siinc - Backup & Recovery for Autodesk Construction Cloud',
    template: '%s | Siinc',
  },
  description:
    'Purpose-built backup and recovery solution for Autodesk Construction Cloud. Protect your BIM360 & BIM Collaborate data with versioned backups, granular restore, and enterprise-grade security.',
  keywords: [
    'Autodesk Construction Cloud',
    'BIM360',
    'BIM Collaborate',
    'Construction backup',
    'Data recovery',
    'Business continuity',
    'Construction technology',
    'AEC backup',
    'Project archival',
    'Compliance',
    'Data resilience',
  ],
  authors: [{ name: 'Siinc Team' }],
  creator: 'Siinc',
  publisher: 'Siinc',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: '48x48' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon.ico' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/favicon/favicon.ico' }],
  },
  openGraph: {
    title: 'Siinc - Backup & Recovery for Autodesk Construction Cloud',
    description:
      'Purpose-built backup and recovery solution for Autodesk Construction Cloud. Protect your BIM360 & BIM Collaborate data with versioned backups, granular restore, and enterprise-grade security.',
    siteName: 'Siinc',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Siinc - Backup & Recovery for Autodesk Construction Cloud',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Siinc - Backup & Recovery for Autodesk Construction Cloud',
    description:
      'Purpose-built backup and recovery solution for Autodesk Construction Cloud. Protect your BIM360 & BIM Collaborate data with versioned backups, granular restore, and enterprise-grade security.',
    images: ['/og-image.jpg'],
    creator: '@siinc',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`h-screen ${inter.variable} ${interTight.variable} antialiased`}
      >
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
