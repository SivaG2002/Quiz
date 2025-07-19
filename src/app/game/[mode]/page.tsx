import React from 'react';
import GameModeClientPage from './GameModeClientPage';

// This is the Server Component for the page.
// It receives params from Next.js and passes them as simple props to the client component.
export default function GameModePage({ params }: { params: { mode: string } }) {
  return <GameModeClientPage mode={params.mode} />;
}
