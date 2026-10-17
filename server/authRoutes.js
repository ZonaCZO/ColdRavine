import { randomBytes } from "node:crypto";
import { hashPassword, verifyPassword } from "./password.js";
import { pool } from "./db.js";
import { ApiError, route, requireAuth, transaction, text, password, age } from "./access.js";

async function loginSession(req, userId) {
  await new Promise((resolve, reject) => req.session.regenerate(error => error ? reject(error) : resolve()));
  req.session.userId = userId;
  await new Promise((resolve, reject) => req.session.save(error => error ? reject(error) : resolve()));
}

export async function registerAuthRoutes(app) {
  const dummyHash = await hashPassword(randomBytes(32).toString("hex"));
  app.post("/api/auth/register", route(async (req, res) => {
    if (req.session.userId) throw new ApiError(409, "Sign out before creating another army");
    const body = req.body ?? {};
    const armyName = text(body.armyName, "Army name");
    const name = text(body.name, "Name");
    const username = text(body.username, "Username", 60);
    const ownerAge = age(body.age);
    const passwordHash = await hashPassword(password(body.password));
    const userId = await transaction(async client => {
      const army = await client.query("INSERT INTO public.armies (name) VALUES ($1) RETURNING id", [armyName]);
      const armyId = army.rows[0].id;
      const soldier = await client.query(`INSERT INTO public.soldiers (army_id, name, rank, status, specialization, age)
        VALUES ($1, $2, 'General', 'Active', 'Command', $3) RETURNING id`, [armyId, name, ownerAge]);
      const user = await client.query(`INSERT INTO public.users (army_id, soldier_id, username, password_hash, role, must_change_password)
        VALUES ($1, $2, $3, $4, 'owner', false) RETURNING id`, [armyId, soldier.rows[0].id, username, passwordHash]);
      return user.rows[0].id;
    });
    await loginSession(req, userId);
    res.status(201).json({ message: "Army created" });
  }));

  app.post("/api/auth/login", route(async (req, res) => {
    const body = req.body ?? {};
    const username = text(body.username, "Username", 60);
    if (typeof body.password !== 'string' || !body.password || body.password.length > 256) throw new ApiError(400, "Password is required");
    const result = await pool.query("SELECT id, password_hash FROM public.users WHERE lower(username) = lower($1)", [username]);
    const user = result.rows[0];
    const matches = await verifyPassword(body.password, user?.password_hash ?? dummyHash);
    if (!user || !matches) throw new ApiError(401, "Incorrect login or password");
    await loginSession(req, user.id);
    res.json({ message: "Credentials accepted" });
  }));

  app.get("/api/auth/me", requireAuth, (req, res) => res.json(req.user));

  app.post("/api/auth/change-password", requireAuth, route(async (req, res) => {
    const body = req.body ?? {};
    if (typeof body.currentPassword !== 'string' || body.currentPassword.length > 256) throw new ApiError(400, "Current password is required");
    const newPassword = password(body.newPassword);
    if (newPassword === body.currentPassword) throw new ApiError(400, "Choose a different password");
    const result = await pool.query("SELECT password_hash FROM public.users WHERE id = $1", [req.user.id]);
    const oldHash = result.rows[0]?.password_hash;
    if (!await verifyPassword(body.currentPassword, oldHash)) throw new ApiError(401, "Incorrect current password");
    const newHash = await hashPassword(newPassword);
    const updated = await pool.query(`UPDATE public.users SET password_hash = $1, must_change_password = false
      WHERE id = $2 AND password_hash = $3 RETURNING id`, [newHash, req.user.id, oldHash]);
    if (!updated.rows[0]) throw new ApiError(409, "Password was changed. Sign in again");
    await loginSession(req, req.user.id);
    res.json({ message: "Password changed" });
  }));

  app.post("/api/auth/logout", (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ message: "Not authenticated" });
    req.session.destroy(error => {
      if (error) return next(error);
      res.clearCookie("connect.sid", { path: "/" });
      res.json({ message: "Logged out" });
    });
  });
}
