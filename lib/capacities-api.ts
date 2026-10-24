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
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { z } from "zod";

export const CAPACITIES_ORIGIN = "https://api.capacities.io";
export const CAPACITIES_SCOPES = "api:read api:write offline_access";
export const CAPACITIES_COOKIE = "unearthed_capacities_oauth";
export const CAPACITIES_CALLBACK = "/api/integrations/capacities/callback";

export class CapacitiesError extends Error {
  constructor(public readonly kind: "reconnect" | "permissions" | "rate-limit" | "unavailable" | "configuration" | "coming-soon") {
    super({
      "coming-soon": CAPACITIES_COMING_SOON,
      reconnect: "Reconnect Capacities in settings to restore access.",
      permissions: "Capacities denied access. Reconnect and approve the requested permissions.",
      "rate-limit": "Capacities is busy. Please try again later.",
      unavailable: "Capacities could not complete the request. Please try again later.",
      configuration: CAPACITIES_COMING_SOON,
    }[kind]);
  }
}

export const connectionSchema = z.object({
  version: z.literal(1),
  clientId: z.string().min(1),
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresAt: z.number().finite(),
  scope: z.string(),
  space: z.object({ id: z.string().uuid(), title: z.string() }),
  needsReconnect: z.boolean().optional(),
});
export type CapacitiesConnection = z.infer<typeof connectionSchema>;

export const oauthStateSchema = z.object({
  userId: z.string().min(1),
  state: z.string().min(43),
  verifier: z.string().min(43).max(128),
  expiresAt: z.number(),
  returnTo: z.enum(["/", "/premium/settings"]),
});

export function validateOAuthState(value: unknown, userId: string, state: string | null, now = Date.now()) {
  const saved = oauthStateSchema.parse(value);
  if (!state || saved.userId !== userId || saved.expiresAt <= now ||
      Buffer.byteLength(state) !== Buffer.byteLength(saved.state) ||
      !timingSafeEqual(Buffer.from(state), Buffer.from(saved.state))) {
    throw new CapacitiesError("reconnect");
  }
  return saved;
}

export function createPKCE() {
  const verifier = randomBytes(32).toString("base64url");
  return { verifier, challenge: createHash("sha256").update(verifier).digest("base64url"), state: randomBytes(32).toString("base64url") };
}

export function capacitiesConfig() {
  const clientId = process.env.CAPACITIES_CLIENT_ID;
  const redirectUri = process.env.CAPACITIES_REDIRECT_URI;
  if (!clientId || !redirectUri) throw new CapacitiesError("configuration");
  const url = new URL(redirectUri);
  const local = process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1"].includes(url.hostname);
  if (url.pathname !== CAPACITIES_CALLBACK || url.search || url.hash || url.username || url.password || (url.protocol !== "https:" && !(local && url.protocol === "http:"))) {
    throw new CapacitiesError("configuration");
  }
  return { clientId, redirectUri, origin: url.origin, secure: url.protocol === "https:" };
}

// Public metadata was verified against the issuer's discovery document. Validate
// endpoint origins before sending a code, verifier or token to a discovered URL.
export async function discoverCapacities() {
  const response = await capacitiesFetch("/.well-known/oauth-authorization-server", { method: "GET" });
  const metadata = await response.json();
  const endpoint = (name: string) => {
    const url = new URL(metadata[name]);
    if (url.origin !== CAPACITIES_ORIGIN || url.username || url.password) throw new CapacitiesError("unavailable");
    return url.toString();
  };
  if (metadata.issuer !== CAPACITIES_ORIGIN) throw new CapacitiesError("unavailable");
  return { authorize: endpoint("authorization_endpoint"), token: endpoint("token_endpoint"), revoke: endpoint("revocation_endpoint") };
}

export async function capacitiesFetch(path: string, init: RequestInit) {
  if (!CAPACITIES_ENABLED) throw new CapacitiesError("coming-soon");
  let response: Response;
  try {
    response = await fetch(new URL(path, CAPACITIES_ORIGIN), { ...init, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15_000) });
  } catch {
    throw new CapacitiesError("unavailable");
  }
  if (!response.ok) {
    // Never propagate provider error bodies: they may contain credentials/content.
    throw new CapacitiesError(response.status === 401 ? "reconnect" : response.status === 403 ? "permissions" : response.status === 429 ? "rate-limit" : "unavailable");
  }
  return response;
}

export function authorizationUrl(endpoint: string, clientId: string, redirectUri: string, challenge: string, state: string) {
  const url = new URL(endpoint);
  url.search = new URLSearchParams({ response_type: "code", client_id: clientId, redirect_uri: redirectUri, scope: CAPACITIES_SCOPES, resource: CAPACITIES_ORIGIN, code_challenge: challenge, code_challenge_method: "S256", state }).toString();
  return url;
}

export async function requestTokens(endpoint: string, params: Record<string, string>, previousScope?: string) {
  if (!CAPACITIES_ENABLED) throw new CapacitiesError("coming-soon");
  let response: Response;
  try {
    response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(params), cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15_000) });
  } catch { throw new CapacitiesError("unavailable"); }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new CapacitiesError(error.error === "invalid_grant" ? "reconnect" : error.error === "invalid_client" || error.error === "unauthorized_client" ? "configuration" : response.status === 429 ? "rate-limit" : "unavailable");
  }
  const token = z.object({ access_token: z.string().min(1), refresh_token: z.string().min(1), expires_in: z.number().finite().positive(), token_type: z.string().refine(v => v.toLowerCase() === "bearer"), scope: z.string().optional() }).parse(await response.json());
  // OAuth permits refresh responses to omit an unchanged scope (RFC 6749).
  const grantedScope = token.scope ?? previousScope ?? "";
  if (!["api:read", "api:write", "offline_access"].every(scope => grantedScope.split(" ").includes(scope))) throw new CapacitiesError("permissions");
  return { accessToken: token.access_token, refreshToken: token.refresh_token, expiresAt: Date.now() + token.expires_in * 1000, scope: grantedScope };
}

export async function readCapacitiesSpace(accessToken: string) {
  const response = await capacitiesFetch("/space", { method: "GET", headers: { Authorization: `Bearer ${accessToken}`, "X-Capacities-Api-Version": "1.0.0" } });
  return z.object({ id: z.string().uuid(), title: z.string() }).parse(await response.json());
}

export async function appendCapacitiesDaily(accessToken: string, markdown: string, day: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !markdown || markdown.length > 200000) throw new CapacitiesError("unavailable");
  await capacitiesFetch("/blocks/daily-note/append", { method: "POST", headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", "X-Capacities-Api-Version": "1.0.0" }, body: JSON.stringify({ markdown, date: `${day}T00:00:00.000Z`, noTimeStamp: true }) });
  // The append is queued by Capacities; either 200 or 204 is valid, with no JSON.
}

export function formatCapacitiesDaily(title?: string | null, author?: string | null, content?: string | null, note?: string | null, location?: string | null) {
  const heading = (text: string) => text.replace(/\r?\n/g, " ").replace(/[\\`*_{}\[\]<>#]/g, "\\$&");
  return ["---", "## 🔥 Remember This?", `### ${heading(title || "Untitled reading")}`, author ? `**Author:** ${heading(author)}` : "", "", ...(content || "").split(/\r?\n/).map(line => `> ${line}`), "", location ? `**Location:** ${heading(location)}` : "", note ? `**My note:** ${note}` : "", "---"].filter(line => line !== "").join("\n\n");
}
