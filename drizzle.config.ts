import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

const connectionString = process.env.DATABASE_URL;

if (!connectionString) throw new Error("DATABASE_URL not set");

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: connectionString,
  },
} satisfies Config;
