import { NextResponse } from "next/server";
import { joinWaitlist } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json();
  const { classId, userId } = body;

  if (!classId || !userId) {
    return NextResponse.json({ error: "classId and userId are required" }, { status: 400 });
  }

  const result = await joinWaitlist(classId, userId);

  if (!result.ok) {
    const status = result.error === "not_found" ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ class: result.class });
}
