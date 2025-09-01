import Image from 'next/image';

import { Card, CardContent, CardHeader } from '../ui/card';

import { cn } from '@/lib/utils';

type FadeDirection = 'right' | 'bottom' | 'top';

type ItemType = {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
    className: string;
  };
  fade: FadeDirection[];
};

const ITEMS: ItemType[] = [
  {
    title: 'Risk & Compliance',
    description:
      'Pass cyber audits and meet insurance/tender requirements with audit-ready logs.',
    image: {
      src: '/images/homepage/resource-allocation/cycle-37.webp',
      alt: 'Compliance dashboard showing audit logs and reports',
      className: 'lg:translate-x-20 translate-x-6 md:translate-x-10',
    },
    fade: ['right'],
  },
  {
    title: 'Project Archive',
    description:
      'Deliver clean, immutable project records for seamless handover.',
    image: {
      src: '/images/homepage/resource-allocation/triage.webp',
      alt: 'Archive interface showing project structure preservation',
      className: 'lg:translate-x-20 translate-x-6 md:translate-x-10',
    },
    fade: ['right', 'bottom'],
  },
  {
    title: 'Service Continuity',
    description:
      'Stay operational during ACC outages with accessible offline backups.',
    image: {
      src: '/images/homepage/resource-allocation/access-controls.webp',
      alt: 'Recovery interface showing instant restore capabilities',
      className: 'translate-x-6 md:translate-x-10 pb-6 object-left-bottom',
    },
    fade: ['right', 'top'],
  },
  {
    title: 'Business Protection',
    description:
      'Retain complete project data if contractors collapse or access is revoked.',
    image: {
      src: '/images/homepage/resource-allocation/task-chat.webp',
      alt: 'Data retention showing complete project history',
      className: 'px-6 mt-4 object-contain',
    },
    fade: [],
  },
  {
    title: 'Secure Workflows',
    description:
      'Encrypted storage with immutable logs and compliance-ready reporting.',
    image: {
      src: '/images/homepage/resource-allocation/cycle-analysis.webp',
      alt: 'Security dashboard showing encryption and access controls',
      className: 'pb-6 object-center object-contain',
    },
    fade: [],
  },
];

export const Feature2 = () => {
  return (
    <section id="complete-control" className="bg-muted py-16 md:py-28 lg:py-32">
      <div className="container">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
          Complete control over your project data
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-6 md:grid-rows-5 lg:mt-20">
          {ITEMS.map((item, i) => {
            const gridClasses = {
              0: 'md:col-span-3 md:row-span-3',
              1: 'md:col-span-3 md:row-span-3 md:col-start-4',
              2: 'md:col-span-2 md:row-span-2 md:row-start-4',
              3: 'md:col-span-2 md:row-span-2 md:col-start-3 md:row-start-4',
              4: 'md:col-span-2 md:row-span-2 md:col-start-5 md:row-start-4',
            }[i];
            return (
              <div
                key={i}
                className={cn(
                  gridClasses,
                  i === 0 && 'ring-accent/20 rounded-lg ring-2',
                )}
              >
                <Item {...item} isFirst={i === 0} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Item = ({
  title,
  description,
  image,
  fade = [],
  className,
  isFirst = false,
}: ItemType & { className?: string; isFirst?: boolean }) => {
  return (
    <Card
      className={cn(
        'relative flex h-full flex-col overflow-hidden border-none px-0 text-lg shadow-none max-md:min-h-[400px]',
        className,
      )}
    >
      <CardHeader className="mb-2">
        <h3 className="inline leading-tight font-semibold text-balance">
          <span className={isFirst ? 'text-accent' : ''}>{title}</span>{' '}
          <span className="text-muted-foreground font-medium">
            {description}
          </span>
        </h3>
      </CardHeader>

      <CardContent className="relative min-h-40 flex-1 overflow-hidden p-0 lg:min-h-48">
        {fade.includes('right') && (
          <div className="to-background absolute inset-0 z-10 h-full bg-linear-to-r from-transparent via-transparent" />
        )}
        {fade.includes('bottom') && (
          <div className="to-background absolute inset-0 z-10 bg-linear-to-b from-transparent via-transparent" />
        )}
        {fade.includes('top') && (
          <div className="to-background absolute inset-0 z-10 bg-linear-to-t from-transparent via-transparent" />
        )}
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className={cn('object-cover object-left-top', image.className)}
        />
      </CardContent>
    </Card>
  );
};
