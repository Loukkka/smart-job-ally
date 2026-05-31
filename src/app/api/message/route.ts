import { NextResponse } from "next/server";

// Replaces the former TanStack Start server function `getServerData`.
// GET /api/message
export async function GET() {
  return NextResponse.json({
    message: "Hello from the Next.js API!",
    timestamp: new Date().toISOString(),
  });
}
