import Link from 'next/link';

import { Facebook, Linkedin, Twitter } from 'lucide-react';

import { Button } from '@/components/ui/button';

const navigation = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '/#feature1' },
      { name: 'Backup & Recovery', href: '/#feature2' },
      { name: 'Enterprise', href: '/#feature3' },
      { name: 'Pricing', href: '/#pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'Learn more', href: '/#feature1' },
      { name: 'Contact', href: '/contact' },
      { name: 'Schedule Demo', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Support', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Compliance', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com' },
  { icon: Twitter, href: 'https://twitter.com' },
  { icon: Linkedin, href: 'https://linkedin.com' },
];

export const Footer = () => {
  return (
    <footer className="bg-primary/60 text-white">
      <div className="bg-primary/60">
        <div className="mx-auto flex max-w-[95vw] flex-col items-center border-b border-white/20 py-10 text-center md:py-14 lg:py-20">
          <h2 className="max-w-[800px] text-5xl leading-none font-semibold tracking-tight text-balance lg:text-6xl">
            Take back control.{' '}
            <span className="text-white/80">Your data can&apos;t wait.</span>
          </h2>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="text-primary mt-9 border-0 bg-white hover:bg-white/90"
          >
            <Link href="/contact">Get started Today</Link>
          </Button>
        </div>

        {/* Navigation Section */}
        <nav className="mx-auto max-w-[95vw] border-b border-white/20 py-12">
          <div className="container">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12 lg:gap-16">
              {navigation.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-4 text-lg font-semibold">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-white/80 transition-colors hover:text-white"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="bg-primary py-8">
          <div className="container">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">
                © {new Date().getFullYear()} Siinc -{' '}
                <Link
                  href="https://siinc.io"
                  className="underline transition-opacity hover:opacity-80"
                  target="_blank"
                >
                  siinc.io
                </Link>
              </p>
              <div className="flex items-center gap-6">
                {socialLinks.map((link) => (
                  <Link
                    aria-label={link.href}
                    key={link.href}
                    href={link.href}
                    className="hover:text-white/70"
                  >
                    <link.icon size={20} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
