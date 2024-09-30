import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const isProduction = process.env.DRIZZLE_ENV === "production";

const databaseUrl = isProduction
  ? process.env.PROD_DATABASE_URL!
  : process.env.DEV_DATABASE_URL!;

const drizzleClient = drizzle(
  postgres(databaseUrl!, {
    prepare: false,
  }),
  { schema }
);

declare global {
  var database: PostgresJsDatabase<typeof schema> | undefined;
}

export const db = global.database || drizzleClient;
if (process.env.NODE_ENV !== "production") global.database = db;
