import { NextResponse } from "next/server";

// Global in-memory session store across requests in Node process
type ActiveSession = {
  lastSeen: number;
};

// Global map declared outside handler to persist across requests
const activeSessions = new Map<string, ActiveSession>();
const BASE_RADIO_LISTENERS = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const sessionId = body.sessionId || Math.random().toString(36).substring(2);
    const now = Date.now();

    // Register/update current session timestamp
    activeSessions.set(sessionId, { lastSeen: now });

    // Clean up stale sessions inactive for more than 10 seconds
    const STALE_TIMEOUT = 10000;
    for (const [id, session] of activeSessions.entries()) {
      if (now - session.lastSeen > STALE_TIMEOUT) {
        activeSessions.delete(id);
      }
    }

    const liveCount = BASE_RADIO_LISTENERS + activeSessions.size;

    return NextResponse.json({
      success: true,
      count: liveCount,
      activeSessions: activeSessions.size,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      count: BASE_RADIO_LISTENERS + Math.max(1, activeSessions.size),
    });
  }
}

export async function GET() {
  const now = Date.now();
  const STALE_TIMEOUT = 10000;
  for (const [id, session] of activeSessions.entries()) {
    if (now - session.lastSeen > STALE_TIMEOUT) {
      activeSessions.delete(id);
    }
  }
  const liveCount = BASE_RADIO_LISTENERS + activeSessions.size;

  return NextResponse.json({
    count: liveCount,
    activeSessions: activeSessions.size,
  });
}
