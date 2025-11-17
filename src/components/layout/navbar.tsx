'use client';

import React, { useState, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ChevronRight } from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuOpen]);

  const ITEMS = [
    {
      label: 'Product',
      href: '#product',
      dropdownItems: [
        {
          title: 'Resilience & Protection',
          href: '/#resilience-protection',
          description:
            'Built for CDE resilience with enterprise-grade features',
        },
        {
          title: 'Complete Control',
          href: '/#complete-control',
          description:
            'Complete control over your project data with compliance ready reports',
        },
        {
          title: 'Enterprise Features',
          href: '/#enterprise-features',
          description: 'Enterprise-grade backup features for CDE workflows',
        },
      ],
    },
    { label: 'Learn more', href: '/#resilience-protection' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  const bgColor = ['/', '/faq', '/signup', '/login'].includes(pathname)
    ? 'bg-sand-100'
    : 'bg-background';

  return (
    <header className={cn('relative z-50', bgColor)}>
      <div className="max-w-9xl container">
        <div className="grid grid-cols-3 items-center py-3">
          {/* Logo */}
          <div className="flex justify-start">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logos/logo.png"
                alt="SIINC logo"
                width={120}
                height={40}
                className="object-contain w-20 lg:w-[120px]"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="flex justify-center">
            <NavigationMenu className="hidden items-center gap-8 lg:flex">
              <NavigationMenuList>
                {ITEMS.map((link) =>
                  link.dropdownItems ? (
                    <NavigationMenuItem key={link.label}>
                      <NavigationMenuTrigger className="text-foreground bg-transparent font-medium lg:text-base">
                        {link.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="w-[400px] p-4">
                          {link.dropdownItems.map((item) => (
                            <li key={item.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={item.href}
                                  className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group flex items-center rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none"
                                >
                                  <div className="space-y-1.5">
                                    <div className="text-sm leading-none font-medium group-hover:text-white">
                                      {item.title}
                                    </div>
                                    <p className="text-muted-foreground line-clamp-2 text-sm leading-tight group-hover:text-white/90">
                                      {item.description}
                                    </p>
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={link.label}>
                      <Link
                        href={link.href}
                        className={cn(
                          'text-foreground p-2 font-medium whitespace-nowrap lg:text-base',
                          pathname === link.href && 'text-muted-foreground',
                        )}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuItem>
                  ),
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Auth Buttons - Right */}
          <div className="flex items-center justify-end gap-2.5 lg:gap-2.5 gap-4">
            <Link
              href="/pricing"
              className={`transition-opacity duration-300 ${isMenuOpen ? 'max-lg:pointer-events-none max-lg:opacity-0' : 'opacity-100'}`}
            >
              <Button
                variant="default"
                className="bg-accent hover:bg-accent/90"
              >
                Get Started
              </Button>
            </Link>
            <Link
              href="https://app.siinc.io"
              className={`hidden transition-opacity duration-300 lg:block ${isMenuOpen ? 'max-lg:pointer-events-none max-lg:opacity-0' : 'opacity-100'}`}
            >
              <Button
                variant="outline"
                className="border-border hover:border-primary/50 hover:bg-primary/5 focus-visible:ring-primary/30 focus-visible:ring-1 focus-visible:ring-offset-0"
              >
                Login
              </Button>
            </Link>
            <div
              className={`hidden transition-opacity duration-300 lg:block ${isMenuOpen ? 'max-lg:pointer-events-none max-lg:opacity-0' : 'opacity-100'}`}
            >
              <ThemeToggle />
            </div>

            {/* Hamburger Menu Button (Mobile Only) */}
            <button
              className="text-muted-foreground relative flex size-8 lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <div className="absolute top-1/2 left-1/2 block w-[18px] -translate-x-1/2 -translate-y-1/2">
                <span
                  aria-hidden="true"
                  className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? 'rotate-45' : '-translate-y-1.5'}`}
                ></span>
                <span
                  aria-hidden="true"
                  className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? 'opacity-0' : ''}`}
                ></span>
                <span
                  aria-hidden="true"
                  className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${isMenuOpen ? '-rotate-45' : 'translate-y-1.5'}`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'absolute inset-0 top-full container flex h-[calc(100vh-64px)] flex-col transition-all duration-300 ease-in-out lg:hidden',
          isMenuOpen
            ? 'visible translate-x-0 opacity-100'
            : 'invisible translate-x-full opacity-0',
          bgColor,
        )}
      >
        <div className="mt-8 space-y-2">
          <Link
            href="/pricing"
            className="block"
            onClick={() => setIsMenuOpen(false)}
          >
            <Button size="sm" className="bg-accent hover:bg-accent/90 w-full">
              Get Started
            </Button>
          </Link>
          <Link
            href="https://app.siinc.io"
            className="block"
            onClick={() => setIsMenuOpen(false)}
          >
            <Button size="sm" variant="outline" className="w-full">
              Login
            </Button>
          </Link>
        </div>
        <nav className="mt-3 flex flex-1 flex-col gap-6">
          {ITEMS.map((link) =>
            link.dropdownItems ? (
              <div key={link.label} className="">
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === link.label ? null : link.label,
                    )
                  }
                  className="text-primary flex w-full items-center justify-between text-lg tracking-[-0.36px]"
                  aria-label={`${link.label} menu`}
                  aria-expanded={openDropdown === link.label}
                >
                  {link.label}
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform',
                      openDropdown === link.label ? 'rotate-90' : '',
                    )}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={cn(
                    'ml-4 space-y-3 overflow-hidden transition-all',
                    openDropdown === link.label
                      ? 'mt-3 max-h-[1000px] opacity-100'
                      : 'max-h-0 opacity-0',
                  )}
                >
                  {link.dropdownItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="hover:bg-accent flex items-start gap-3 rounded-md p-2"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setOpenDropdown(null);
                      }}
                    >
                      <div>
                        <div className="text-primary font-medium">
                          {item.title}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  'text-primary text-lg tracking-[-0.36px]',
                  pathname === link.href && 'text-muted-foreground',
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
