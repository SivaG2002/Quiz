
import { NextResponse } from 'next/server';

// Use an environment variable for the target URL.
// The fallback is a non-functional placeholder to make it clear the variable must be set.
const TARGET_URL = process.env.SCORE_SERVER_URL || 'https://4a3dae1c2cd1.ngrok-free.app/api/score';

/**
 * API endpoint to proxy score submission.
 * It receives the score from the client and forwards it to the target server.
 */
export async function POST(request: Request) {
  try {
    // Check if the environment variable is set. If not, log a helpful error.
    if (!process.env.SCORE_SERVER_URL) {
        console.warn("WARNING: SCORE_SERVER_URL environment variable is not set.");
        console.warn(`Falling back to hardcoded URL: ${TARGET_URL}`);
    }

    const body = await request.json();
    const { user_id, username, score } = body;

    if (user_id === undefined || username === undefined || score === undefined) {
      return NextResponse.json({ error: 'user_id, username, and score are required' }, { status: 400 });
    }

    // Forward the request to the target server (your Flask app via ngrok)
    const externalResponse = await fetch(TARGET_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, username, score }),
    });

    if (!externalResponse.ok) {
        // If the external server responds with an error, forward that error back to the client
        const errorBody = await externalResponse.text();
        console.error(`External server error: ${externalResponse.status} ${errorBody}`);
        return NextResponse.json({ error: `Failed to submit score to external server. Status: ${externalResponse.status}` }, { status: externalResponse.status });
    }

    const responseData = await externalResponse.json();

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('API Proxy Error:', error);
    // This catches network errors, e.g., if the target server is down
    return NextResponse.json({ error: `Failed to connect to the score server at ${TARGET_URL}. Is it running and is the URL correct?` }, { status: 502 }); // 502 Bad Gateway
  }
}
