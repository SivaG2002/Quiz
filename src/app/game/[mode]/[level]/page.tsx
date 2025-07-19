import React from 'react';
import GameClientPage from './GameClientPage';

// This is the Server Component for the page.
// It receives params and passes them as simple props to the client component.
export default function GamePage({ params }: { params: { mode: string, level: string } }) {
  return <GameClientPage mode={params.mode} level={params.level} />;
}
