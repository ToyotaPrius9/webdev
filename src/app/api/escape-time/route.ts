import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { timeSeconds, studentId } = body;

    if (typeof timeSeconds !== "number" || timeSeconds < 0) {
      return NextResponse.json(
        { error: "Invalid timeSeconds" },
        { status: 400 }
      );
    }

    const record = await prisma.escapeTime.create({
      data: {
        timeSeconds,
        studentId: studentId ?? null,
        route: "/escape",
      },
    });

    return NextResponse.json({ success: true, record }, { status: 201 });
  } catch (err) {
    console.error("Error saving escape time:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: top 10 fastest times
export async function GET() {
  try {
    const records = await prisma.escapeTime.findMany({
      where: { route: "/escape" },
      orderBy: [
        { timeSeconds: "asc" },
        { createdAt: "asc" },
      ],
      take: 10,
    });

    return NextResponse.json({ records }, { status: 200 });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
