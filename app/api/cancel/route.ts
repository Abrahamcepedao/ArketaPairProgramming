import { NextResponse } from "next/server";
import { cancelBooking } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json();
  const { classId, userId } = body;

  const updated = cancelBooking(classId, userId);
  return NextResponse.json({ class: updated });
}
