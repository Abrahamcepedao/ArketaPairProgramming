import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, initializeStore, setCurrentUser } from "@/lib/store";
import { MOCK_USERS } from "@/lib/users";

export async function GET() {
await initializeStore();
  const user = getCurrentUser();
  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
  await initializeStore();
  const { userId } = await req.json();
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  await setCurrentUser(user);
  return NextResponse.json(user);
}
