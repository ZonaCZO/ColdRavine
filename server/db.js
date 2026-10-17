import pg from "pg";

const { Pool } = pg;

// Local PG* variables remain supported; cloud deployments use DATABASE_URL.
export const pool = new Pool({
  ...(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {}),
  max: 3,
  idleTimeoutMillis: 10000,
  allowExitOnIdle: true,
  connectionTimeoutMillis: 5000,
  query_timeout: 10000,
});

pool.on("error", () => {
  console.error("Unexpected PostgreSQL connection error");
});
