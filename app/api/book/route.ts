import { NextResponse } from "next/server";
import { bookClass, getClasses } from "@/lib/store";

// TODO: validate classId exists
export async function POST(req: Request) {
  const body = await req.json();
  const { classId, userId } = body;

  const cls = getClasses().find((c) => c.id === classId);
  if (cls && cls.bookedUsers >= cls.capacity) {
    return NextResponse.json({ error: "Class is full" }, { status: 400 });
  }

  const updated = bookClass(classId, userId);
  if (!updated) {
    return NextResponse.json({ error: "Already booked" }, { status: 409 });
  }
  return NextResponse.json({ class: updated });
}
