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
import "server-only";
import { db } from "@/db";
import { dailyQuotes, profiles, quotes, sources } from "@/db/schema";
import { decrypt, encrypt } from "@/lib/auth/encryptionKey";
import { and, eq } from "drizzle-orm";
import { appendCapacitiesDaily, CapacitiesConnection, CapacitiesError, capacitiesConfig, connectionSchema, discoverCapacities, formatCapacitiesDaily, readCapacitiesSpace, requestTokens } from "@/lib/capacities-api";

export type CapacitiesStatus = {
  state: "disconnected" | "connected" | "reconnect" | "coming-soon";
  configured: boolean;
  spaceTitle?: string;
};
export type CapacitiesResult = { ok: boolean; message: string; alreadySent?: boolean };

// Reuse the encrypted legacy credential column to avoid a database migration.
// Its plaintext is now a versioned OAuth envelope, never a pasted personal token.
// Only this server module may read it; getProfile() always redacts both columns.
async function decode(value: string | null, key: string) {
  if (!value) return null;
  const parsed = connectionSchema.safeParse(JSON.parse(await decrypt(value, key)));
  return parsed.success ? parsed.data : null;
}

async function readConnection(value: string | null, key: string) {
  try { return await decode(value, key); } catch { return null; }
}

export async function capacitiesStatus(userId: string, key: string): Promise<CapacitiesStatus> {
  if (!CAPACITIES_ENABLED) return { state: "coming-soon", configured: false };
  const profile = await db.query.profiles.findFirst({ where: eq(profiles.userId, userId) });
  const connection = await readConnection(profile?.capacitiesApiKey || null, key);
  let configured = false;
  try { capacitiesConfig(); configured = true; } catch { /* Owner setup pending. */ }
  return {
    configured,
    state: connection && !connection.needsReconnect ? "connected" : profile?.capacitiesApiKey ? "reconnect" : "disconnected",
    spaceTitle: connection?.space.title,
  };
}

export async function saveCapacitiesConnection(userId: string, key: string, connection: CapacitiesConnection) {
  if (!CAPACITIES_ENABLED) throw new CapacitiesError("coming-soon");
  // Atomic upsert also handles accounts without a profile. Only integration fields
  // change on conflict; unrelated settings cannot overwrite rotated credentials.
  const values = { capacitiesApiKey: await encrypt(JSON.stringify(connectionSchema.parse(connection)), key), capacitiesSpaceId: await encrypt(connection.space.id, key) };
  await db.insert(profiles).values({ userId, userStatus: "ACTIVE", ...values }).onConflictDoUpdate({ target: profiles.userId, set: values });
}

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function usableConnection(tx: Transaction, userId: string, key: string, stored: string | null) {
  const connection = await readConnection(stored, key);
  if (!connection || connection.needsReconnect) throw new CapacitiesError("reconnect");
  if (connection.expiresAt <= Date.now() + 60_000) {
    try {
      const endpoints = await discoverCapacities();
      const tokens = await requestTokens(endpoints.token, { grant_type: "refresh_token", refresh_token: connection.refreshToken, client_id: connection.clientId }, connection.scope);
      Object.assign(connection, tokens);
      await tx.update(profiles).set({ capacitiesApiKey: await encrypt(JSON.stringify(connection), key) }).where(eq(profiles.userId, userId));
    } catch (error) {
      if (error instanceof CapacitiesError && ["reconnect", "permissions"].includes(error.kind)) {
        connection.needsReconnect = true;
        await tx.update(profiles).set({ capacitiesApiKey: await encrypt(JSON.stringify(connection), key) }).where(eq(profiles.userId, userId));
      }
      throw error;
    }
  }
  return connection;
}

function failed(error: unknown): CapacitiesResult {
  return { ok: false, message: error instanceof CapacitiesError ? error.message : "Could not complete the Capacities request. Please try again later." };
}

async function connectionFailed(tx: Transaction, userId: string, key: string, error: unknown) {
  if (error instanceof CapacitiesError && ["reconnect", "permissions"].includes(error.kind)) {
    // Read again to retain a token that may have rotated earlier in this transaction.
    const [profile] = await tx.select().from(profiles).where(eq(profiles.userId, userId));
    const connection = await readConnection(profile?.capacitiesApiKey || null, key);
    if (connection) await tx.update(profiles).set({ capacitiesApiKey: await encrypt(JSON.stringify({ ...connection, needsReconnect: true }), key) }).where(eq(profiles.userId, userId));
  }
  return failed(error);
}

// Every refresh, send, check, connect and disconnect locks the same profile row.
// This serializes rotating refresh tokens across server instances and cron jobs.
// Expected provider errors return INSIDE the transaction so a new refresh token
// stays committed even if the subsequent API operation fails.
export async function checkCapacitiesConnection(userId: string, key: string): Promise<CapacitiesResult> {
  if (!CAPACITIES_ENABLED) return { ok: false, message: CAPACITIES_COMING_SOON };
  try {
    return await db.transaction(async tx => {
      const [profile] = await tx.select().from(profiles).where(eq(profiles.userId, userId)).for("update");
      try {
        const connection = await usableConnection(tx, userId, key, profile?.capacitiesApiKey || null);
        connection.space = await readCapacitiesSpace(connection.accessToken);
        await tx.update(profiles).set({ capacitiesApiKey: await encrypt(JSON.stringify(connection), key) }).where(eq(profiles.userId, userId));
        return { ok: true, message: `Connected to ${connection.space.title}.` };
      } catch (error) { return connectionFailed(tx, userId, key, error); }
    });
  } catch (error) { return failed(error); }
}

export async function disconnectCapacitiesConnection(userId: string, key: string): Promise<CapacitiesResult> {
  if (!CAPACITIES_ENABLED) return { ok: false, message: CAPACITIES_COMING_SOON };
  try {
    return await db.transaction(async tx => {
      const [profile] = await tx.select().from(profiles).where(eq(profiles.userId, userId)).for("update");
      try {
        const connection = await readConnection(profile?.capacitiesApiKey || null, key);
        if (connection) {
          const endpoints = await discoverCapacities();
          const response = await fetch(endpoints.revoke, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ token: connection.refreshToken, token_type_hint: "refresh_token", client_id: connection.clientId }), cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15_000) });
          if (!response.ok) throw new CapacitiesError("unavailable");
        }
        await tx.update(profiles).set({ capacitiesApiKey: null, capacitiesSpaceId: null }).where(eq(profiles.userId, userId));
        return { ok: true, message: "Capacities disconnected. If you previously used a personal API key, revoke that key in Capacities too." };
      } catch (error) { return failed(error); }
    });
  } catch (error) { return failed(error); }
}

export async function deliverCapacitiesDaily(userId: string, key: string, dailyId: string): Promise<CapacitiesResult> {
  if (!CAPACITIES_ENABLED) return { ok: false, message: CAPACITIES_COMING_SOON };
  try {
    return await db.transaction(async tx => {
      const [profile] = await tx.select().from(profiles).where(eq(profiles.userId, userId)).for("update");
      try {
        if (!profile?.capacitiesApiKey) return { ok: false, message: "Connect Capacities in settings first." };
        const [daily] = await tx.select().from(dailyQuotes).where(and(eq(dailyQuotes.id, dailyId), eq(dailyQuotes.userId, userId))).for("update");
        if (!daily) return { ok: false, message: "No daily reflection is available yet." };
        if (daily.capacitiesUpdated) return { ok: true, alreadySent: true, message: "This reflection has already been sent to Capacities." };
        const [reflection] = await tx.select({ quote: quotes, source: sources }).from(quotes).innerJoin(sources, eq(sources.id, quotes.sourceId)).where(and(eq(quotes.id, daily.quoteId), eq(quotes.userId, userId), eq(sources.userId, userId)));
        if (!reflection || !daily.day) return { ok: false, message: "No daily reflection is available yet." };
        const connection = await usableConnection(tx, userId, key, profile.capacitiesApiKey);
        const note = reflection.quote.note ? await decrypt(reflection.quote.note, key) : "";
        const markdown = formatCapacitiesDaily(reflection.source.title, reflection.source.author, reflection.quote.content, note, reflection.quote.location);
        await appendCapacitiesDaily(connection.accessToken, markdown, daily.day);
        await tx.update(dailyQuotes).set({ capacitiesUpdated: true }).where(and(eq(dailyQuotes.id, daily.id), eq(dailyQuotes.userId, userId)));
        return { ok: true, message: "Capacities accepted the reflection. It may take a moment to appear in your daily note." };
      } catch (error) { return connectionFailed(tx, userId, key, error); }
    });
  } catch (error) { return failed(error); }
}
