'use client';
import { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Autoplay from 'embla-carousel-autoplay';
import {
  ArrowRight,
  Shield,
  Clock,
  Database,
  CheckCircle2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

const features = [
  {
    title: 'Scheduled backups',
    description: 'Continuous incremental protection for your ACC data.',
    icon: Clock,
  },
  {
    title: 'Granular restore',
    description: 'Recover by file, folder, or entire project instantly.',
    icon: Database,
  },
  {
    title: 'Full metadata',
    description: 'Preserve all versions, permissions, and audit trails.',
    icon: Shield,
  },
  {
    title: 'Native integration',
    description: 'Direct ACC integration with OAuth - no agents required.',
    icon: CheckCircle2,
  },
];

const SLIDES = [
  { image: '/images/homepage/hero.webp', label: 'Dashboard' },
  { image: '/images/homepage/hero2.webp', label: 'Recovery' },
  { image: '/images/homepage/hero3.webp', label: 'Compliance' },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="bg-sand-100 relative overflow-hidden pt-16 md:pt-24 lg:pt-32">
      <div className="relative container grid gap-12 lg:grid-cols-[1fr_0.68fr]">
        {/* Gradient border */}
        <div className="to-foreground/27 absolute inset-x-0 bottom-0 z-10 -mr-[max(5rem,calc((100vw-80rem)/2+5rem))] h-px bg-linear-to-r from-transparent" />
        {/* Left side - Content */}
        <div className="space-y-8 lg:space-y-12">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Independent, versioned backups for Autodesk Construction Cloud
            </h1>

            <p className="text-sand-700 font-inter-tight mt-3 text-3xl leading-13 font-medium md:text-4xl lg:text-5xl">
              Purpose-built synchronization layer that gives your business true
              control over BIM360 & BIM Collaborate data.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex max-w-[250px] gap-2.5 lg:gap-5"
                >
                  <Icon className="mt-1 size-4 shrink-0 lg:size-5" />
                  <div>
                    <h2 className="font-inter font-semibold">
                      {feature.title}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/contact">
              <Button
                aria-label="Get started"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Get started
              </Button>
            </Link>
            <Link href="/#feature1">
              <Button
                aria-label="Learn more"
                variant="outline"
                className="border-gray-200 bg-white text-black hover:bg-white hover:text-black hover:opacity-90"
              >
                <span className="flex items-center gap-2 text-start whitespace-pre-wrap">
                  Learn more
                  <ArrowRight className="size-4 stroke-3" />
                </span>
              </Button>
            </Link>
          </div>

          <SlideIndicator
            currentSlide={currentSlide}
            slides={SLIDES}
            className="mb-4! max-lg:hidden"
            api={api}
          />
        </div>

        {/* Right side - Carousel */}
        <div className="relative -mr-[max(5rem,calc((100vw-80rem)/2+5rem))] shadow-xl max-lg:translate-x-10 lg:shadow-2xl">
          <Carousel
            className="size-full [&>div]:size-full"
            setApi={setApi}
            opts={{
              loop: true,
            }}
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
          >
            <CarouselContent className="size-full">
              {SLIDES.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="relative size-full min-h-[30rem] overflow-hidden rounded-t-xl">
                    <Image
                      src={slide.image}
                      alt={`Siinc backup interface showing ${slide.label}`}
                      fill
                      className="object-cover object-left-top"
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <SlideIndicator
        currentSlide={currentSlide}
        slides={SLIDES}
        className="mt-6 mb-8 lg:hidden"
        api={api}
      />
    </section>
  );
};

interface SlideIndicatorProps {
  currentSlide: number;
  slides: Array<{ label: string }>;
  className?: string;
  api: CarouselApi | null;
}

const SlideIndicator = ({
  currentSlide,
  slides,
  className,
  api,
}: SlideIndicatorProps) => {
  return (
    <div className={cn('flex flex-col items-center font-medium', className)}>
      <div className="">
        <span className="text-sand-700">{currentSlide + 1} of 3 — </span>
        <span className="text-primary">{slides[currentSlide].label}</span>
      </div>
      <div className="flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="py-2"
          >
            <div
              className={cn(
                'h-0.5 w-6 rounded-full transition-colors',
                index === currentSlide
                  ? 'bg-primary'
                  : 'bg-primary/20 hover:bg-primary/40',
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
