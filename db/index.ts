/**
 * Copyright (C) 2025 Unearthed App
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

import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const isProduction = process.env.DRIZZLE_ENV === "production";

const databaseUrl = isProduction
  ? process.env.PROD_DATABASE_URL!
  : process.env.DEV_DATABASE_URL!;

if (!databaseUrl) {
  throw new Error(
    `Database URL not found. Make sure ${isProduction ? "PROD_DATABASE_URL" : "DEV_DATABASE_URL"} is set in your environment variables.`
  );
}

const drizzleClient = drizzle(
  postgres(databaseUrl, {
    prepare: false,
    max: 1,
  }),
  { schema }
);

declare global {
  var database: PostgresJsDatabase<typeof schema> | undefined;
}

export const db = global.database || drizzleClient;
if (process.env.NODE_ENV !== "production") global.database = db;
