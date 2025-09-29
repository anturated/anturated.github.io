import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";

const todoSchema = z.object({
  id: z.uuid(),
  text: z.string().min(1),
  done: z.boolean(),
  content: z.string(),
})

export async function GET() {
  const todos = await prisma.todo.findMany();
  return NextResponse.json(todos);
}


export async function PUT(req: Request) {
  const body = await req.json()
  const parsed = todoSchema.parse({
    ...body,
    id: crypto.randomUUID(),
    done: false,
    content: "",
  });

  const todo = await prisma.todo.create({ data: parsed });
  return NextResponse.json(todo, { status: 201 });
}

export async function POST(req: Request) {
  try {
    const request = todoSchema.parse(await req.json());

    const updated = await prisma.todo.update({
      where: { id: request.id },
      data: { text: request.text, content: request.content, done: request.done },
    })
    return NextResponse.json(updated);

  } catch (e) {
    console.log(e);
    return NextResponse.json(e, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const todo = todoSchema.parse(await req.json());
    const result = await prisma.todo.delete({ where: { id: todo.id } });

    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(e, { status: 400 });
  }
}

