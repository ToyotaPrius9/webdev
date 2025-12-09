import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const records = await prisma.escapeTime.findMany({
      orderBy: [
        { timeSeconds: "asc" },
        { createdAt: "asc" },
      ],
      take: 5,
    });

    return NextResponse.json({ records }, { status: 200 });
  } catch (error) {
    console.error("Error fetching escape times:", error);
    return NextResponse.json(
      { error: "Failed to fetch escape times" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.timeSeconds !== "number") {
      return NextResponse.json(
        { error: "timeSeconds is required and must be a number" },
        { status: 400 }
      );
    }

    const {
      timeSeconds,
      studentId,
      studentFirstName,
      route,
      note,
    } = body as {
      timeSeconds: number;
      studentId?: string;
      studentFirstName?: string;
      route?: string;
      note?: string | null;
    };

    const record = await prisma.escapeTime.create({
      data: {
        timeSeconds: Math.max(0, Math.floor(timeSeconds)),
        studentId: typeof studentId === "string" ? studentId : null,
        studentFirstName:
          typeof studentFirstName === "string" ? studentFirstName : null,
        route: typeof route === "string" ? route : "/escape",
        note: typeof note === "string" ? note : null,
      },
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    console.error("Error creating escape time:", error);
    return NextResponse.json(
      { error: "Failed to create escape time" },
      { status: 500 }
    );
  }
}