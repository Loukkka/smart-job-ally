import { NextResponse } from "next/server";

// GET /api/stats — sample data served from a Next.js route handler.
// In a real app this would query a database.
export async function GET() {
  return NextResponse.json({
    stats: [
      { label: "Active applications", value: 12 },
      { label: "Interviews scheduled", value: 3 },
      { label: "AI matches this week", value: 28 },
      { label: "Profile views", value: 147 },
    ],
  });
}
