import Image from 'next/image';

import {
  CalendarClock,
  FolderSync,
  ShieldAlert,
  FileArchive,
} from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    title: 'Scheduled Backups',
    description:
      'Continuous incremental protection with customizable schedules.',
    content: {
      title: 'Automated protection that never sleeps',
      description: `Set it and forget it. SIINC continuously backs up your CDE projects with incremental snapshots, minimizing data loss and ensuring you always have recent recovery points available.`,
      image: '/images/homepage/features-tabs/1.webp',
      className: 'md:[&_img]:translate-x-20 [&_img]:translate-x-5 ',
    },
    icon: CalendarClock,
  },
  {
    title: 'Granular Restore',
    description: 'Recover by file, folder, or entire project instantly.',
    content: {
      title: 'Surgical precision recovery when you need it',
      description:
        "Don't restore everything when you only need one file. SIINC provides granular restore capabilities down to individual files, with fast RTOs that minimize disruption to your workflows.",
      image: '/images/homepage/features-tabs/2.webp',
    },
    icon: FolderSync,
  },
  {
    title: 'BYO Storage',
    description: 'Azure, AWS, or any S3-compatible destination.',
    content: {
      title: 'Your data, your cloud, your control',
      description:
        'Maintain complete data sovereignty with flexible storage options. Whether you prefer public cloud, private cloud, or on-premises storage, SIINC adapts to your infrastructure requirements.',
      image: '/images/homepage/features-tabs/3.webp',
    },
    icon: FileArchive,
  },
  {
    title: 'Compliance Reports',
    description: 'ISO/cyber-insurance aligned documentation.',
    content: {
      title: 'Audit-ready reports at your fingertips',
      description:
        'Generate comprehensive compliance reports that satisfy insurers, auditors, and regulatory requirements. Full metadata preservation ensures complete audit trails for every project.',
      image: '/images/homepage/features-tabs/4.webp',
    },
    icon: ShieldAlert,
  },
];

export const Feature3 = () => {
  return (
    <section
      id="enterprise-features"
      className="bg-mint-50 py-16 md:py-28 lg:py-32"
    >
      <div className="container">
        <div className="flex flex-col gap-3 md:flex-row">
          <h2 className="flex-1 text-3xl font-semibold tracking-tight text-balance md:text-4xl lg:text-5xl">
            Enterprise-grade backup features
          </h2>
          <p className="text-muted-foreground flex-1 text-lg font-medium md:max-w-md md:self-end">
            SIINC delivers comprehensive backup capabilities specifically
            designed for the unique requirements of construction projects and
            CDE workflows.
          </p>
        </div>

        <Tabs
          defaultValue={FEATURES[0].title}
          orientation="vertical"
          className="mt-8 flex gap-4 max-lg:flex-col-reverse md:mt-12 lg:mt-20"
        >
          <TabsList className="flex h-auto justify-start overflow-x-auto rounded-xl bg-black/[0.03] p-1.5 lg:basis-1/4 lg:flex-col">
            {FEATURES.map((feature) => (
              <TabsTrigger
                key={feature.title}
                value={feature.title}
                className="data-[state=active]:text-accent data-[state=active]:border-accent dark:data-[state=active]:text-accent w-full min-w-[200px] flex-1 justify-start rounded-lg px-4 py-3 text-start whitespace-normal text-gray-700 transition-colors duration-300 data-[state=active]:border-l-4 data-[state=active]:shadow-xl lg:px-6 lg:py-4 dark:text-gray-300"
              >
                <div>
                  <feature.icon className="size-7 md:size-8 lg:size-9" />
                  <h3 className="mt-3 font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {feature.description}
                  </p>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {FEATURES.map((feature) => (
            <TabsContent
              className={cn(
                'bg-background m-0 flex-1 overflow-hidden rounded-xl',
                feature.content.className,
              )}
              key={feature.title}
              value={feature.title}
            >
              <div className="max-w-2xl p-5 text-lg text-balance lg:p-7">
                <h4 className="inline font-semibold">
                  {feature.content.title}{' '}
                </h4>
                <span className="text-muted-foreground mt-2 font-medium text-pretty">
                  {feature.content.description}
                </span>
              </div>
              <div className="relative h-[420px] rounded-lg lg:h-[500px] lg:flex-1">
                <Image
                  src={feature.content.image}
                  alt={feature.title}
                  fill
                  className="object-cover object-left-top"
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};
