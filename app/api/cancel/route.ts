import { NextResponse } from "next/server";
import { cancelBooking } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json();
  const { classId, userId } = body;

  const updated = await cancelBooking(classId, userId);
  const response = NextResponse.json({ class: updated });
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  return response;
}
