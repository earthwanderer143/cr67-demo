import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: {
    id?: string;
  };
};

export async function DELETE(_req: Request, { params }: RouteContext) {
  const id = params?.id;

  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  try {
    const deleted = await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true, todo: deleted });
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

    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}