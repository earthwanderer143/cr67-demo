import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type TodoPriority = "LOW" | "MEDIUM" | "HIGH";

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const body = await req.json();
  const title = typeof body?.title === "string" ? body.title : "";

  if (!title || !title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const rawPriority = body?.priority;
  const allowedPriorities: readonly TodoPriority[] = ["LOW", "MEDIUM", "HIGH"];
  const priority: TodoPriority | undefined =
    typeof rawPriority === "string" && (allowedPriorities as readonly string[]).includes(rawPriority)
      ? (rawPriority as TodoPriority)
      : undefined;

  const todo = await prisma.todo.create({
    data: { title: title.trim(), priority },
  });

  return NextResponse.json(todo);
}