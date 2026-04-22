import { NextResponse } from "next/server";
import { getClasses, initializeStore } from "@/lib/store";

export async function GET() {
  await initializeStore();
  const response = NextResponse.json({ classes: getClasses() });
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  return response;
}
