import pg from "pg";

const { Pool } = pg;

// PGHOST, PGPORT, PGDATABASE, PGUSER and PGPASSWORD come from server/.env.
export const pool = new Pool({
  connectionTimeoutMillis: 5000,
  query_timeout: 10000,
});

pool.on("error", () => {
  console.error("Unexpected PostgreSQL connection error");
});
