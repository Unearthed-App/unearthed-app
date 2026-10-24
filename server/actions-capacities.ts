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

"use server";

import { CAPACITIES_ENABLED } from "@/lib/capacities-availability";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateEncryptionKey } from "@/lib/auth/encryptionKey";
import { capacitiesStatus, checkCapacitiesConnection, disconnectCapacitiesConnection } from "./capacities";

async function authenticated() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  return { userId, key: CAPACITIES_ENABLED ? await getOrCreateEncryptionKey() : "" };
}

export async function getCapacitiesStatus() {
  const { userId, key } = await authenticated();
  return capacitiesStatus(userId, key);
}

export async function checkCapacities() {
  const { userId, key } = await authenticated();
  return checkCapacitiesConnection(userId, key);
}

export async function disconnectCapacities() {
  const { userId, key } = await authenticated();
  return disconnectCapacitiesConnection(userId, key);
}
