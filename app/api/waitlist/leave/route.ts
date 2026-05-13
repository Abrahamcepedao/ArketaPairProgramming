import { NextResponse } from "next/server";
import { leaveWaitlist } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json();
  const { classId, userId } = body;

  if (!classId || !userId) {
    return NextResponse.json({ error: "classId and userId are required" }, { status: 400 });
  }

  const result = await leaveWaitlist(classId, userId);

  if (!result) {
    return NextResponse.json({ error: "Not on waitlist" }, { status: 404 });
  }

  return NextResponse.json({ class: result });
}
