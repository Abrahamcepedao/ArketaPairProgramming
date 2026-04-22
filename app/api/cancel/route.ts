import { NextResponse } from "next/server";
import { cancelBooking } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json();
  const { classId } = body;

  const updated = cancelBooking(classId);
  return NextResponse.json({ class: updated });
}
