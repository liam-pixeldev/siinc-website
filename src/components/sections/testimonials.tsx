'use client';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

const TESTIMONIALS = [
  {
    quote:
      'Siinc saved us during an ACC outage last month. We restored critical drawings in minutes and kept the project moving.',
    author: 'Sarah Mitchell, BIM Manager',
    company: 'Turner Construction',
    image: '/images/homepage/testimonials/amy-chase.webp',
    className: 'object-top',
  },

  {
    quote:
      'Finally, a backup solution that understands construction workflows. The granular restore feature has been a game-changer for our team.',
    author: 'Michael Chen, IT Director',
    company: 'Skanska USA',
    image: '/images/homepage/testimonials/victoria-smith.webp',
  },
  {
    quote:
      "We passed our ISO audit with flying colors thanks to Siinc's compliance reports. The auditors were impressed with our data governance.",
    author: 'Emily Rodriguez, Project Manager',
    company: 'Bechtel Corporation',
    image: '/images/homepage/testimonials/kevin-yam.webp',
    className: 'object-top',
  },
  {
    quote:
      'When our subcontractor went bankrupt, Siinc ensured we retained all project documentation. It literally saved us millions in potential disputes.',
    author: 'David Thompson',
    company: 'Lendlease',
    image: '/images/homepage/testimonials/kundo-marta.webp',
    className: 'object-top',
  },
  {
    quote:
      "Setup took less than 30 minutes, and now we have enterprise-grade backup for all our ACC projects. Best investment we've made this year.",
    author: 'Rachel Park, Construction Technology Lead',
    company: 'Mortenson Construction',
    image: '/images/homepage/testimonials/jonas-kotara.webp',
    className: 'object-top',
  },
];

export default function Testimonials() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="bg-mint py-16 md:py-28 lg:py-32">
      <div className="container">
        <div className="flex flex-col gap-3 md:flex-row">
          <h2 className="flex-1 text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
            Trusted by
            <br />
            leading construction firms
          </h2>
          <div className="flex flex-1 flex-col items-start gap-3 md:max-w-md md:self-end">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              From ENR Top 100 contractors to specialized BIM consultancies,
              Siinc protects critical construction data for firms that can't
              afford downtime or data loss.
            </p>
            <Button
              asChild
              variant="outline"
              className="group border-border hover:border-primary/50 hover:bg-primary/5 focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
            >
              <Link href="/contact">
                Schedule a demo
                <ArrowRight className="text-primary ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 md:mt-12 lg:mt-20">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <div className="relative -mr-[max(2rem,calc((100vw-80rem)/2+5rem))]">
              <CarouselContent className="">
                {TESTIMONIALS.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-4/5 md:basis-1/2 lg:basis-[34%]"
                  >
                    <Card
                      className={`h-full overflow-hidden border-[7px] transition-all ${
                        current === index
                          ? 'border-foreground'
                          : 'border-mint text-emerald-600 shadow-none'
                      }`}
                    >
                      <CardHeader className="p-0">
                        <div
                          className={cn(
                            'relative aspect-[4/3.3] w-full bg-emerald-600/20',
                          )}
                        >
                          <div className="absolute inset-0">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.author}
                              fill
                              className={cn(
                                'object-cover transition-all',
                                testimonial.className,
                                current != index && 'mix-blend-luminosity',
                              )}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-5 pb-7">
                        <blockquote className="text-lg leading-7 font-semibold tracking-tight text-balance md:text-xl lg:text-2xl">
                          {testimonial.quote}
                        </blockquote>
                      </CardContent>
                      <CardFooter className="flex-col items-start">
                        <div className="font-semibold max-md:text-sm">
                          {testimonial.author}
                        </div>
                        <div className="text-muted-foreground text-xs md:text-sm">
                          {testimonial.company}
                        </div>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </div>

            <div className="container">
              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  {TESTIMONIALS.map((_, index) => (
                    <button
                      key={index}
                      className={`size-4 rounded-full transition-colors ${
                        current === index
                          ? 'bg-background'
                          : 'bg-background/40 hover:bg-background/60'
                      }`}
                      onClick={() => api?.scrollTo(index)}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <CarouselPrevious className="bg-background/40 hover:bg-background/60 static size-11 translate-y-0 [&>svg]:size-6" />
                  <CarouselNext className="bg-background/40 hover:bg-background/60 static size-11 translate-y-0 [&>svg]:size-6" />
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
