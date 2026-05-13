import { NextResponse } from "next/server";
import { getBookingsByUser } from "@/lib/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const classes = getBookingsByUser(userId);
  return NextResponse.json({ classes });
}
