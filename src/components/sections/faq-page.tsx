'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Button } from '../ui/button';

import { cn } from '@/lib/utils';

type Category =
  | 'Getting Started'
  | 'Backup & Recovery'
  | 'Security & Compliance'
  | 'Pricing & Plans'
  | 'Technical';

interface FAQItem {
  question: string;
  answer: string;
  category: Category;
}

const faqItems: FAQItem[] = [
  // Getting Started Questions
  {
    category: 'Getting Started',
    question: 'How long does it take to set up Siinc?',
    answer:
      "Setup takes less than 30 minutes. Simply authorize Siinc through OAuth with your Autodesk Construction Cloud account, select the projects you want to backup, choose your storage destination, and you're protected. No agents or complex configurations required.",
  },
  {
    category: 'Getting Started',
    question: 'Do I need to install any software?',
    answer:
      'No installation required. Siinc is a cloud-based solution that connects directly to your ACC environment through secure OAuth authentication. Everything runs in the cloud with no agents needed on your local machines.',
  },
  {
    category: 'Getting Started',
    question: 'Which Autodesk products does Siinc support?',
    answer:
      'Siinc supports all Autodesk Construction Cloud products including BIM360, BIM Collaborate, BIM Collaborate Pro, Build, and Docs. We provide full backup capabilities for all file types, metadata, permissions, and version history.',
  },
  // Backup & Recovery Questions
  {
    category: 'Backup & Recovery',
    question: 'How often are backups performed?',
    answer:
      'Backup frequency depends on your plan. Professional plans offer hourly incremental backups, while Starter plans provide daily backups. All backups are incremental, meaning only changes are backed up after the initial full backup, minimizing storage costs and backup time.',
  },
  {
    category: 'Backup & Recovery',
    question: 'How quickly can I restore lost data?',
    answer:
      'Recovery is nearly instant. You can restore individual files in seconds, folders in minutes, or entire projects within an hour, depending on size. Our granular restore capability means you only recover what you need, minimizing downtime.',
  },
  {
    category: 'Backup & Recovery',
    question: 'What happens during an Autodesk outage?',
    answer:
      'Your backed-up data remains fully accessible through Siinc during any ACC outage. You can browse, download, and share project files, ensuring business continuity even when Autodesk services are unavailable. This keeps your teams productive during disruptions.',
  },
  {
    category: 'Backup & Recovery',
    question: 'Can I restore to a different ACC account?',
    answer:
      'Yes, Siinc supports cross-account restoration. This is particularly useful for disaster recovery scenarios, migrating projects between accounts, or when recovering data after contractor access is revoked.',
  },
  // Security & Compliance Questions
  {
    category: 'Security & Compliance',
    question: 'How is my data secured?',
    answer:
      'All data is encrypted both in transit and at rest using industry-standard AES-256 encryption. Access is controlled through your existing ACC permissions, and all activities are logged for audit purposes. We maintain SOC 2 Type II compliance and undergo regular security audits.',
  },
  {
    category: 'Security & Compliance',
    question: 'Does Siinc help with compliance requirements?',
    answer:
      'Yes, Siinc provides immutable audit logs, automated compliance reports, and full metadata preservation that satisfy ISO standards, cyber insurance requirements, and regulatory audits. Reports can be generated on-demand and are accepted by major insurers and auditors.',
  },
  {
    category: 'Security & Compliance',
    question: 'Where is my data stored?',
    answer:
      'You have complete control over data storage location. Choose from Azure, AWS, any S3-compatible storage, or on-premises solutions. This ensures compliance with data sovereignty requirements and gives you full control over your data.',
  },
  {
    category: 'Security & Compliance',
    question: 'What certifications does Siinc have?',
    answer:
      'Siinc maintains SOC 2 Type II certification, is ISO 27001 compliant, and meets requirements for cyber insurance policies. Our platform is regularly audited and penetration tested by third-party security firms.',
  },
  // Pricing & Plans Questions
  {
    category: 'Pricing & Plans',
    question: 'How does pricing work?',
    answer:
      'Siinc offers transparent per-GB pricing for Professional plans, with volume discounts available. Starter plans begin at $299/month for up to 100GB. Enterprise plans offer custom pricing with additional features like dedicated support and SLA guarantees.',
  },
  {
    category: 'Pricing & Plans',
    question: 'Is there a free trial?',
    answer:
      'Yes, we offer a 30-day free trial with full functionality. No credit card required to start. This gives you time to test Siinc with your actual projects and workflows before committing to a paid plan.',
  },
  {
    category: 'Pricing & Plans',
    question: 'Can I change plans anytime?',
    answer:
      'Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated. There are no long-term contracts or cancellation fees.',
  },
  // Technical Questions
  {
    category: 'Technical',
    question: 'What are the system requirements?',
    answer:
      'Siinc is entirely cloud-based, so there are no specific system requirements. You just need a modern web browser and an active Autodesk Construction Cloud account. The platform works with Chrome, Firefox, Safari, and Edge.',
  },
  {
    category: 'Technical',
    question: 'How much storage do I need?',
    answer:
      'Storage needs vary by project size and backup retention policies. On average, construction projects require 50-200GB per project including all versions and metadata. Our team can help estimate your specific needs during a consultation.',
  },
  {
    category: 'Technical',
    question: 'Does Siinc affect ACC performance?',
    answer:
      "No, Siinc operates independently and doesn't impact your ACC performance. Backups run in the background using ACC's APIs without affecting your team's daily workflows or file access speeds.",
  },
];

const categories: Category[] = [
  'Getting Started',
  'Backup & Recovery',
  'Security & Compliance',
  'Pricing & Plans',
  'Technical',
];

const TOP_PADDING = 300;

export const FAQPage = () => {
  const [activeCategory, setActiveCategory] =
    useState<Category>('Getting Started');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isScrollingRef = useRef(false);
  const categoryRefs = useRef<Record<Category, HTMLDivElement | null>>({
    'Getting Started': null,
    'Backup & Recovery': null,
    'Security & Compliance': null,
    'Pricing & Plans': null,
    Technical: null,
  });

  const setupObserver = useCallback(() => {
    observerRef.current?.disconnect();

    let debounceTimeout: NodeJS.Timeout;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Skip if we're programmatically scrolling
        if (isScrollingRef.current) return;

        // Clear any pending timeout
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }

        // Debounce the category update
        debounceTimeout = setTimeout(() => {
          const intersectingEntries = entries.filter(
            (entry) => entry.isIntersecting,
          );

          // Find the entry that's closest to being 100px from the top
          const entry = intersectingEntries.reduce(
            (closest, current) => {
              const rect = current.boundingClientRect;
              const distanceFromThreshold = Math.abs(rect.top - TOP_PADDING);
              const closestDistance = closest
                ? Math.abs(closest.boundingClientRect.top - TOP_PADDING)
                : Infinity;

              return distanceFromThreshold < closestDistance
                ? current
                : closest;
            },
            null as IntersectionObserverEntry | null,
          );

          if (entry) {
            const category = entry.target.getAttribute(
              'data-category',
            ) as Category;
            if (category) {
              setActiveCategory(category);
            }
          }
        }, 150);
      },
      {
        root: null,
        rootMargin: `-${TOP_PADDING}px 0px -100% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    Object.entries(categoryRefs.current).forEach(([category, element]) => {
      if (element) {
        element.setAttribute('data-category', category);
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, []);

  useEffect(() => {
    const cleanup = setupObserver();
    return () => {
      cleanup();
      observerRef.current?.disconnect();
    };
  }, [setupObserver]);

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category);
    isScrollingRef.current = true;

    const element = document.getElementById(`faq-${category.toLowerCase()}`);
    if (element) {
      element.style.scrollMargin = `${TOP_PADDING}px`;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  return (
    <section className="bg-sand-100 min-h-screen py-16 md:py-28 lg:py-32">
      <div className="container max-w-4xl">
        <div className="text-center">
          <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-center text-balance">
            Everything you need to know about protecting your Autodesk
            Construction Cloud data with Siinc.
          </p>
        </div>

        <div className="mt-8 grid max-w-5xl gap-8 md:mt-12 md:grid-cols-[200px_1fr] md:gap-12 lg:mt-16">
          {/* Sidebar */}
          <div className="sticky top-24 flex h-fit flex-col gap-4 max-md:hidden">
            {categories.map((category) => (
              <Button
                variant="ghost"
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`justify-start text-left text-xl transition-colors ${
                  activeCategory === category
                    ? 'font-semibold'
                    : 'font-normal hover:opacity-75'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* FAQ Items by Category */}
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryItems = faqItems.filter(
                (item) => item.category === category,
              );

              return (
                <div
                  key={category}
                  id={`faq-${category.toLowerCase()}`}
                  ref={(el) => {
                    categoryRefs.current[category] = el;
                  }}
                  className={cn(
                    `rounded-xl`,
                    activeCategory === category
                      ? 'bg-background'
                      : 'bg-background/40',
                    'px-6',
                  )}
                  style={{
                    scrollMargin: `${TOP_PADDING}px`,
                  }}
                >
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue={`${categories[0]}-0`}
                    className="w-full"
                  >
                    {categoryItems.map((item, i) => (
                      <AccordionItem
                        key={i}
                        value={`${category}-${i}`}
                        className="border-muted border-b last:border-0"
                      >
                        <AccordionTrigger className="text-base font-medium hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base font-medium">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
