import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { getOrCreateDailyReflection } from "@/server/actions";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const dailyReflection = await getOrCreateDailyReflection();

  return NextResponse.json({ dailyReflection }, { status: 200 });
}
