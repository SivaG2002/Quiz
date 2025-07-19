
import { NextResponse } from 'next/server';

const TARGET_URL = 'http://192.168.0.119:9003/api/user';

/**
 * API endpoint to proxy score submission.
 * It receives the score from the client and forwards it to the target server.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, score } = body;

    if (username === undefined || score === undefined) {
      return NextResponse.json({ error: 'Username and score are required' }, { status: 400 });
    }

    // Forward the request to the target server
    const externalResponse = await fetch(TARGET_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, score }),
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
    return NextResponse.json({ error: 'Failed to connect to the score server.' }, { status: 502 }); // 502 Bad Gateway
  }
}
