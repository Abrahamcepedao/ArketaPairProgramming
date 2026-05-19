import { NextResponse } from "next/server";
import { bookClass, getClasses } from "@/lib/store";

// TODO: validate classId exists
export async function POST(req: Request) {
  const body = await req.json();
  const { classId } = body;

  const cls = getClasses().find((c) => c.id === classId);
  if (!cls) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  const now = new Date();
  const classDate = new Date(cls.datetime);
  if (classDate < now) {
    return NextResponse.json({ error: "Cannot book a class in the past" }, { status: 400 });
  }

  if (cls.bookedUsers >= cls.capacity) {
    return NextResponse.json({ error: "Class is full" }, { status: 400 });
  }

  const updated = bookClass(classId);
  return NextResponse.json({ class: updated });
}
