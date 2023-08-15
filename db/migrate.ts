import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from ".";
import { exit } from "process";

export const migrateDb = async () => {
  console.log("Migrating database...");
  await migrate(db, {
    migrationsFolder: "drizzle",
  });
  console.log("Database migrated");
  exit(0);
};

migrateDb();
