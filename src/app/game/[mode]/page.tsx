import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const validModes = [
  'addition',
  'subtraction',
  'multiplication',
  'squared',
  'cubes',
  'square-roots',
];

function getGameTitle(mode: string) {
  switch (mode) {
    case 'addition':
      return 'Addition';
    case 'subtraction':
      return 'Subtraction';
    case 'multiplication':
      return 'Multiplication';
    case 'squared':
      return 'Squared';
    case 'cubes':
      return 'Cubes';
    case 'square-roots':
      return 'Square Roots';
    default:
      return 'Game';
  }
}

export default function GameModePage({ params }: { params: { mode: string } }) {
  const { mode } = params;

  if (!validModes.includes(mode)) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-headline">
            {getGameTitle(mode)} Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-8 py-8">
            <h2 className="text-2xl font-semibold text-muted-foreground">Choose a Level</h2>
            <div className="flex flex-col sm:flex-row gap-6">
                <Link href={`/game/${mode}/test`} passHref>
                    <Button 
                        variant="outline" 
                        className="w-48 h-16 text-xl"
                        aria-label="Start Test Level"
                    >
                        Test Level
                    </Button>
                </Link>
                <Link href={`/game/${mode}/competitive`} passHref>
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
