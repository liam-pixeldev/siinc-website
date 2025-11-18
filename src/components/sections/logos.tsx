'use client';

import Image from 'next/image';
import Link from 'next/link';

const ITEMS = [
  {
    name: 'Autodesk Construction Cloud',
    src: '/images/logos/autodesk-cloud.png',
    href: 'https://construction.autodesk.com',
  },
  {
    name: 'AWS',
    src: '/images/logos/aws.png',
    href: 'https://aws.amazon.com',
  },
  {
    name: 'Autodesk BIM',
    src: '/images/logos/autodesk-bim.png',
    href: 'https://www.autodesk.com/solutions/bim',
  },
  {
    name: 'Microsoft Azure',
    src: '/images/logos/azure.png',
    href: 'https://azure.microsoft.com',
  },
  {
    name: 'Amazon S3',
    src: '/images/logos/s3.png',
    href: 'https://aws.amazon.com/s3/',
  },
  {
    name: 'BIM 360',
    src: '/images/logos/bim360.png',
    href: 'https://www.autodesk.com/bim-360/',
  },
  {
    name: 'Autodesk Authorized Developer',
    src: '/images/logos/authorized-dev.png',
    href: 'https://www.autodesk.com/developer-network',
  },
  {
    name: 'Bentley Developer Network',
    src: '/images/logos/bentley.png',
    href: 'https://www.bentley.com/',
  },
];

export default function Logos() {
  return (
    <section className="bg-sand-100 overflow-hidden py-12 md:py-20 lg:py-24">
      <div className="container text-center">
        <h2 className="text-xl font-semibold tracking-tight text-balance lg:text-3xl">
          Trusted by Leading Partners &amp; Integrators
          <br />
          <span className="text-muted-foreground">
            Delivering enterprise-grade backup solutions across the
            architectural, engineering and construction industries.
          </span>
        </h2>
      </div>

      <div className="relative mt-10">
        <div className="flex w-full">
          {/* First marquee group */}
          <div className="animate-marquee flex shrink-0 items-center gap-12">
            {ITEMS.map((logo, index) => (
              <Link
                href={logo.href}
                target="_blank"
                key={index}
                className="flex items-center justify-center p-6"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={120}
                  height={40}
                  className="h-[40px] w-auto object-contain opacity-50 grayscale transition-opacity hover:opacity-70"
                />
              </Link>
            ))}
          </div>
          {/* Second marquee group */}
          <div className="animate-marquee flex shrink-0 items-center gap-12">
            {ITEMS.map((logo, index) => (
              <Link
                href={logo.href}
                target="_blank"
                key={index}
                className="flex items-center justify-center p-6"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={120}
                  height={40}
                  className="h-[40px] w-auto object-contain opacity-50 grayscale transition-opacity hover:opacity-70"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
