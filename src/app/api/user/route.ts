
import { NextResponse } from 'next/server';

/**
 * API endpoint to handle user profile updates.
 * For this simple example, it just acknowledges the request.
 * In a real app, this would save the username to a database.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    console.log(`Received username from external source: ${username}`);
    
    // Here you would typically save the username to your database.
    // For now, we'll just simulate a successful response.

    return NextResponse.json({ message: `Username '${username}' received successfully.` });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
