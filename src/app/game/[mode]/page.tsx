
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import React, { Suspense } from 'react';

const validModes = [
  'addition',
  'subtraction',
  'multiplication',
  'squared',
  'cubes',
  'square-roots',
];

const customizableModes = ['squared', 'cubes', 'square-roots'];

function getGameTitle(mode: string) {
  switch (mode) {
    case 'addition': return 'Addition';
    case 'subtraction': return 'Subtraction';
    case 'multiplication': return 'Multiplication';
    case 'squared': return 'Squared';
    case 'cubes': return 'Cubes';
    case 'square-roots': return 'Square Roots';
    default: return 'Game';
  }
}

function GameModePage({ params }: { params: { mode: string } }) {
  const { mode } = params;
  const [limit, setLimit] = useState(15);

  if (!validModes.includes(mode)) {
    notFound();
  }

  const isCustomizable = customizableModes.includes(mode);
  
  const getLevelHref = (level: 'test' | 'competitive') => {
    let href = `/game/${mode}/${level}`;
    if (isCustomizable) {
        href += `?limit=${limit}`;
    }
    return href;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-headline">
            {getGameTitle(mode)} Challenge
          </CardTitle>
          {isCustomizable && (
             <CardDescription className="text-center pt-2">
                Use the slider to set the maximum number for the problems.
             </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-8 py-8">
             {isCustomizable && (
                <div className="w-full max-w-sm flex flex-col items-center gap-4">
                    <Slider
                        defaultValue={[limit]}
                        min={5}
                        max={50}
                        step={1}
                        onValueChange={(value) => setLimit(value[0])}
                    />
                    <div className="text-xl font-bold text-primary">{limit}</div>
                </div>
             )}
            <h2 className={cn("text-2xl font-semibold text-muted-foreground", isCustomizable ? "mt-4" : "")}>
                Choose a Level
            </h2>
            <div className="flex flex-col sm:flex-row gap-6">
                <Link href={getLevelHref('test')} passHref>
                    <Button 
                        variant="outline" 
                        className="w-48 h-16 text-xl"
                        aria-label="Start Test Level"
                    >
                        Test Level
                    </Button>
                </Link>
                <Link href={getLevelHref('competitive')} passHref>
                    <Button 
                        variant="default" 
                        className="w-48 h-16 text-xl shadow-lg hover:shadow-primary/40"
                        aria-label="Start Competitive Level"
                    >
                        Competitive Level
                    </Button>
                </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}


export default function GameModeLoader(props: any) {
    return (
        <Suspense fallback={<main className="flex min-h-screen flex-col items-center justify-center p-8"><p>Loading...</p></main>}>
            <GameModePage {...props} />
        </Suspense>
    )
}
