import express from "express";
import session from "express-session";
import { randomBytes } from "node:crypto";
import { hashPassword, verifyPassword } from "./password.js";
import { pool } from "./db.js";
import { registerUnitRoutes } from "./unitRoutes.js";
import { registerReadRoutes } from "./readRoutes.js";

await pool.query("SELECT 1");
console.log("Database connected");
const dummyPasswordHash = await hashPassword(randomBytes(32).toString("hex"));

const app = express();
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "temporary-learning-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false, sameSite: "lax" },
}));

async function requireAuth(req, res, next) {
  if (!Number.isInteger(req.session.userId)) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    const result = await pool.query(`
      SELECT id, username, army_id AS "armyId", soldier_id AS "soldierId",
        role, must_change_password AS "mustChangePassword"
      FROM public.users WHERE id = $1
    `, [req.session.userId]);

    if (!result.rows[0]) return res.status(401).json({ message: "Not authenticated" });
    req.user = result.rows[0];
    next();
  } catch {
    res.status(500).json({ message: "Failed to check session" });
  }
}

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body ?? {};
  if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  try {
    const result = await pool.query(
      "SELECT id, password_hash FROM public.users WHERE lower(username) = lower($1)",
      [username.trim()],
    );
    const user = result.rows[0];
    const passwordMatches = await verifyPassword(password, user?.password_hash ?? dummyPasswordHash);
    if (!user || !passwordMatches) {
      return res.status(401).json({ message: "Incorrect login or password" });
    }
    req.session.regenerate((error) => {
      if (error) return res.status(500).json({ message: "Failed to log in" });
      req.session.userId = user.id;
      res.json({ message: "Credentials accepted" });
    });
  } catch {
    res.status(500).json({ message: "Failed to log in" });
  }
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json(req.user);
});

app.post("/api/auth/logout", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: "You are not logged in" });
  req.session.destroy((error) => {
    if (error) return res.status(500).json({ message: "Failed to log out" });
    res.clearCookie("connect.sid", { path: "/" });
    res.json({ message: "Logged out" });
  });
});

// Resolve the current army from the account in the DB, never from the request body.
app.use("/api", requireAuth);

const soldierSelect = `
  SELECT s.id, s.name, s.rank, COALESCE(u.name, 'Unassigned') AS unit,
    s.status, s.specialization, s.age
  FROM public.soldiers s
  LEFT JOIN public.units u ON u.id = s.unit_id AND u.army_id = s.army_id
`;

app.get("/api/soldiers", async (req, res) => {
  try {
    const result = await pool.query(`${soldierSelect} WHERE s.army_id = $1 ORDER BY s.id`, [req.user.armyId]);
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Failed to load personnel" });
  }
});

app.get("/api/soldiers/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    return res.status(404).json({ message: "Soldier not found" });
  }
  try {
    const result = await pool.query(`${soldierSelect} WHERE s.army_id = $1 AND s.id = $2`, [req.user.armyId, id]);
    if (!result.rows[0]) return res.status(404).json({ message: "Soldier not found" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Failed to load soldier" });
  }
});

registerUnitRoutes(app);
registerReadRoutes(app);

app.get("/", (req, res) => res.send("Server is running"));
app.use("/api", (req, res) => res.status(404).json({ message: "API route not found" }));

app.listen(3000, () => {
  console.log("Server: http://localhost:3000");
});
