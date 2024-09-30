import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const isProduction = process.env.DRIZZLE_ENV === "production";

const databaseUrl = isProduction
  ? process.env.PROD_DATABASE_URL!
  : process.env.DEV_DATABASE_URL!;

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
});
