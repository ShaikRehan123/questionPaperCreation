import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { examTable } from "./schema";
import { InferModel } from "drizzle-orm";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) throw new Error("DATABASE_URL not set");

const client = postgres(connectionString || "");

export type Exam = InferModel<typeof examTable>;
export type createExam = InferModel<typeof examTable, "insert">;

export const db = drizzle(client, {
  schema,
});
