/**
 * Copyright (C) 2026 Unearthed App
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { CAPACITIES_ENABLED, CAPACITIES_COMING_SOON } from "@/lib/capacities-availability";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { encrypt, getOrCreateEncryptionKey } from "@/lib/auth/encryptionKey";
import { authorizationUrl, CAPACITIES_COOKIE, capacitiesConfig, createPKCE, discoverCapacities } from "@/lib/capacities-api";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!CAPACITIES_ENABLED) {
    const response = NextResponse.json({ status: "coming-soon", error: CAPACITIES_COMING_SOON }, { status: 503, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
    response.cookies.set(CAPACITIES_COOKIE, "", { maxAge: 0, path: "/api/integrations/capacities" });
    return response;
  }
  try {
    const config = capacitiesConfig();
    const endpoints = await discoverCapacities();
    const pkce = createPKCE();
    const key = await getOrCreateEncryptionKey();
    const state = await encrypt(JSON.stringify({ userId, state: pkce.state, verifier: pkce.verifier, expiresAt: Date.now() + 600_000, returnTo: request.nextUrl.searchParams.get("returnTo") === "/premium/settings" ? "/premium/settings" : "/" }), key);
    const response = NextResponse.redirect(authorizationUrl(endpoints.authorize, config.clientId, config.redirectUri, pkce.challenge, pkce.state));
    response.cookies.set(CAPACITIES_COOKIE, state, { httpOnly: true, secure: config.secure, sameSite: "lax", maxAge: 600, path: "/api/integrations/capacities" });
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  } catch {
    return NextResponse.json({ error: "The Capacities connection is unavailable. Please try again later." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
