import { pool } from "./db.js";

const reportSelect = `
  SELECT r.id, r.title, r.type, r.threat, r.location, r.description,
    COALESCE(u.username, 'Not assigned') AS author,
    to_char(r.report_date, 'YYYY-MM-DD') AS date
  FROM public.intelligence_reports r
  LEFT JOIN public.users u ON u.id = r.author_id AND u.army_id = r.army_id
`;

export function registerReadRoutes(app) {
  app.get("/api/operations", async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT id, name, status, priority FROM public.operations WHERE army_id = $1 ORDER BY id",
        [req.user.armyId],
      );
      res.json(result.rows);
    } catch {
      res.status(500).json({ message: "Failed to load operations" });
    }
  });

  app.get("/api/operations/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
      return res.status(404).json({ message: "Operation not found" });
    }
    try {
      const result = await pool.query(
        "SELECT id, name, status, priority FROM public.operations WHERE army_id = $1 AND id = $2",
        [req.user.armyId, id],
      );
      if (!result.rows[0]) return res.status(404).json({ message: "Operation not found" });
      res.json(result.rows[0]);
    } catch {
      res.status(500).json({ message: "Failed to load operation" });
    }
  });

  app.get("/api/intelligence", async (req, res) => {
    try {
      const result = await pool.query(`${reportSelect} WHERE r.army_id = $1 ORDER BY r.id`, [req.user.armyId]);
      res.json(result.rows);
    } catch {
      res.status(500).json({ message: "Failed to load reports" });
    }
  });

  app.get("/api/intelligence/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
      return res.status(404).json({ message: "Report not found" });
    }
    try {
      const result = await pool.query(`${reportSelect} WHERE r.army_id = $1 AND r.id = $2`, [req.user.armyId, id]);
      if (!result.rows[0]) return res.status(404).json({ message: "Report not found" });
      res.json(result.rows[0]);
    } catch {
      res.status(500).json({ message: "Failed to load report" });
    }
  });
}
