import { NextResponse } from "next/server";
import { bookClass, getClasses } from "@/lib/store";
import { isInPast, isFull, isUserBooked } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json();
  const { classId, userId } = body;

  const cls = getClasses().find((c) => c.id === classId);
  if (!cls) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 });
  }

  if (isInPast(cls)) {
    return NextResponse.json({ error: "Cannot book class in the past" }, { status: 400 });
  }

  if (isUserBooked(cls, userId)) {
    return NextResponse.json({ error: "User already booked this class" }, { status: 400 });
  }

  if (isFull(cls)) {
    return NextResponse.json({ error: "Class is full" }, { status: 400 });
  }

  const updated = await bookClass(classId, userId);
  const response = NextResponse.json({ class: updated });
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  return response;
}
