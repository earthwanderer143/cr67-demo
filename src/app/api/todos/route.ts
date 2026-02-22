import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const body = await req.json();
  const title = body?.title;
  const rawPriority = body?.priority;

  if (!title || !title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const priority =
    rawPriority === "LOW" || rawPriority === "MEDIUM" || rawPriority === "HIGH"
      ? rawPriority
      : undefined;

  const todo = await prisma.todo.create({
    data: { title: title.trim(), priority },
  });

  return NextResponse.json(todo);
}