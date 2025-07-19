
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import UserProfile from '@/components/UserProfile';

const gameModes = [
  { name: 'Addition', href: '/game/addition' },
  { name: 'Subtraction', href: '/game/subtraction' },
  { name: 'Multiplication', href: '/game/multiplication' },
  { name: 'Squared', href: '/game/squared' },
  { name: 'Cubes', href: '/game/cubes' },
  { name: 'Square Roots', href: '/game/square-roots' },
];

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMenuVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const currentMenuRef = menuRef.current;
    if (currentMenuRef) {
      observer.observe(currentMenuRef);
    }

    return () => {
      if (currentMenuRef) {
        observer.unobserve(currentMenuRef);
      }
    };
  }, []);

  return (
    <div className="bg-background">
      <div className="absolute top-4 right-4 z-10">
        <UserProfile />
      </div>
      <section className="flex flex-col items-center justify-center w-full h-screen text-center relative p-4">
        <div className="flex flex-col items-center gap-6">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold font-headline bg-gradient-to-r from-black to-[hsl(var(--primary))] text-transparent bg-clip-text py-2">
              Welcome
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-body max-w-2xl">
              to <span className="font-bold text-foreground">MathVerse</span>, where you can play games and learn maths at the same time. Scroll down to begin!
            </p>
        </div>
        <div className="absolute bottom-10 animate-bounce">
            <ArrowDown className="w-8 h-8 text-muted-foreground" />
        </div>
      </section>
      
      <section id="menu" ref={menuRef} className="py-24 w-full flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-5xl px-4">
            <h2 className={cn(
                "text-4xl md:text-5xl font-bold mb-16 font-headline text-center transition-all duration-700 transform",
                menuVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            )}>Choose Your Challenge</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {gameModes.map((mode, index) => (
                <div
                  key={mode.name}
                  className={cn(
                    'opacity-0',
                    menuVisible ? 'animate-popup' : ''
                  )}
                  style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                >
                  <Link href={mode.href} passHref>
                    <Button
                      variant="default"
                      className="w-full h-28 text-3xl font-semibold shadow-lg rounded-xl transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-primary/40 focus:scale-105 focus:shadow-primary/40"
                      aria-label={`Start ${mode.name} game`}
                    >
                      {mode.name}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
        </div>
      </section>
    </div>
  );
}
