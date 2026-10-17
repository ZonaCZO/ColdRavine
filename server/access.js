import { pool } from "./db.js";

export const permissionNames = [
  "soldiers.create", "soldiers.edit", "soldiers.assign", "units.edit",
  "units.assign_commander", "operations.manage", "intelligence.manage",
];

export class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export function route(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
}

export function requireOwner(req, res, next) {
  if (req.user.role !== "owner") return res.status(403).json({ message: "Owner access required" });
  next();
}

export function requireStaff(req, res, next) {
  if (!['owner', 'officer'].includes(req.user.role)) return res.status(403).json({ message: "Officer access required" });
  next();
}

export function requirePermission(permission) {
  return (req, res, next) => {
    if (req.user.role === "owner" || (req.user.role === "officer" && req.user.permissions.includes(permission))) return next();
    res.status(403).json({ message: "Permission denied" });
  };
}

export async function requireAuth(req, res, next) {
  if (!Number.isInteger(req.session.userId)) return res.status(401).json({ message: "Not authenticated" });
  try {
    const result = await pool.query(`
      SELECT u.id, u.username, u.army_id AS "armyId", a.name AS "armyName",
        u.soldier_id AS "soldierId", u.role, u.must_change_password AS "mustChangePassword",
        ARRAY(SELECT p.permission FROM public.user_permissions p WHERE p.user_id = u.id ORDER BY p.permission) AS permissions
      FROM public.users u JOIN public.armies a ON a.id = u.army_id WHERE u.id = $1
    `, [req.session.userId]);
    if (!result.rows[0]) return res.status(401).json({ message: "Not authenticated" });
    req.user = result.rows[0];
    next();
  } catch (error) { next(error); }
}

export function requireChangedPassword(req, res, next) {
  if (req.user.mustChangePassword) return res.status(403).json({ message: "Change your temporary password first", code: "PASSWORD_CHANGE_REQUIRED" });
  next();
}

export function text(value, field, max = 120) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) throw new ApiError(400, `${field} is required (maximum ${max} characters)`);
  return value.trim();
}
export function password(value) {
  if (typeof value !== "string" || value.length < 8 || value.length > 256) throw new ApiError(400, "Password must contain 8–256 characters");
  return value;
}
export function id(value) {
  if (!Number.isInteger(value) || value < 1 || value > 2147483647) throw new ApiError(400, "Invalid ID");
  return value;
}
export function age(value) {
  if (!Number.isInteger(value) || value < 0 || value > 150) throw new ApiError(400, "Age must be between 0 and 150");
  return value;
}
export function choice(value, allowed) {
  if (!allowed.includes(value)) throw new ApiError(400, "Invalid status");
  return value;
}
export async function transaction(callback) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally { client.release(); }
}
export async function ownUnit(client, armyId, unitId) {
  if (unitId === null) return;
  id(unitId);
  const result = await client.query("SELECT id FROM public.units WHERE army_id = $1 AND id = $2 FOR SHARE", [armyId, unitId]);
  if (!result.rows[0]) throw new ApiError(404, "Unit not found");
}
