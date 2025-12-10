import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params; 

  if (!id) {
    return NextResponse.json(
      { error: "Missing record id" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { note } = body as { note?: string | null };

    if (note !== null && typeof note !== "string") {
      return NextResponse.json(
        { error: "note must be a string or null" },
        { status: 400 }
      );
    }

    const record = await prisma.escapeTime.update({
      where: { id },
      data: {
        note: note === undefined ? null : note,
      },
    });

    return NextResponse.json({ record }, { status: 200 });
  } catch (error) {
    console.error("Error updating escape time note:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params; 

  if (!id) {
    return NextResponse.json(
      { error: "Missing record id" },
      { status: 400 }
    );
  }

  try {
    await prisma.escapeTime.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting escape time:", error);
    return NextResponse.json(
      { error: "Failed to delete record" },
      { status: 500 }
    );
  }
}