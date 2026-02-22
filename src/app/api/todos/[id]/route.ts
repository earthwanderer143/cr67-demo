import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }

  try {
    await prisma.todo.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, error: "Todo not found" },
        { status: 404 }
      );
    }

    console.error("Failed to delete todo:", err);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}