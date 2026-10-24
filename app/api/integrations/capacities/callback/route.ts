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
import { decrypt, getOrCreateEncryptionKey } from "@/lib/auth/encryptionKey";
import { CAPACITIES_COOKIE, capacitiesConfig, discoverCapacities, readCapacitiesSpace, requestTokens, validateOAuthState } from "@/lib/capacities-api";
import { saveCapacitiesConnection } from "@/server/capacities";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!CAPACITIES_ENABLED) {
    const response = NextResponse.json({ status: "coming-soon", error: CAPACITIES_COMING_SOON }, { status: 503, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
    response.cookies.set(CAPACITIES_COOKIE, "", { maxAge: 0, path: "/api/integrations/capacities" });
    return response;
  }
  let config;
  try { config = capacitiesConfig(); } catch { return NextResponse.json({ error: "Capacities is not configured." }, { status: 503 }); }
  let returnTo = "/";
  let status = "error";
  try {
    const key = await getOrCreateEncryptionKey();
    const cookie = request.cookies.get(CAPACITIES_COOKIE)?.value;
    if (!cookie) throw new Error("Missing OAuth state");
    const state = validateOAuthState(JSON.parse(await decrypt(cookie, key)), userId, request.nextUrl.searchParams.get("state"));
    returnTo = state.returnTo;
    if (request.nextUrl.searchParams.has("error")) {
      status = "cancelled";
    } else {
      const code = request.nextUrl.searchParams.get("code");
      if (!code) throw new Error("Missing code");
      const endpoints = await discoverCapacities();
      const tokens = await requestTokens(endpoints.token, { grant_type: "authorization_code", code, redirect_uri: config.redirectUri, client_id: config.clientId, code_verifier: state.verifier });
      const space = await readCapacitiesSpace(tokens.accessToken);
      await saveCapacitiesConnection(userId, key, { version: 1, clientId: config.clientId, ...tokens, space });
      status = "connected";
    }
  } catch {
    // No OAuth codes, credentials, provider bodies or user content in logs/URLs.
    status = "error";
  }
  const url = new URL(returnTo, config.origin);
  url.searchParams.set("capacities", status);
  const response = NextResponse.redirect(url);
  response.cookies.set(CAPACITIES_COOKIE, "", { httpOnly: true, secure: config.secure, sameSite: "lax", maxAge: 0, path: "/api/integrations/capacities" });
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
