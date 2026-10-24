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

import "server-only";

import { db } from "@/db";
import { sources } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export async function ownsSources(userId: string, sourceIds: string[]): Promise<boolean> {
  const ids = [...new Set(sourceIds)];
  if (!ids.length) return true;

  const owned = await db.select({ id: sources.id }).from(sources).where(
    and(eq(sources.userId, userId), inArray(sources.id, ids))
  );
  return owned.length === ids.length;
}
