import { NextResponse } from "next/server";
import { syncBooks } from "@/server/actions";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncBooks();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
