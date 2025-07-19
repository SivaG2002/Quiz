import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';

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

export default function GamePage({ params }: { params: { mode: string } }) {
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
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground">
              Game screen for {getGameTitle(mode).toLowerCase()} will be here.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
