import { pool } from "./db.js";

const unitColumns = "id, name, specialization, status, commander_id AS commander";

export function registerUnitRoutes(app) {
  app.get("/api/units", async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT ${unitColumns} FROM public.units WHERE army_id = $1 ORDER BY id`,
        [req.user.armyId],
      );
      res.json(result.rows);
    } catch {
      res.status(500).json({ message: "Failed to load units" });
    }
  });

  app.get("/api/units/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
      return res.status(404).json({ message: "Unit not found" });
    }
    try {
      const result = await pool.query(
        `SELECT ${unitColumns} FROM public.units WHERE army_id = $1 AND id = $2`,
        [req.user.armyId, id],
      );
      if (!result.rows[0]) return res.status(404).json({ message: "Unit not found" });
      res.json(result.rows[0]);
    } catch {
      res.status(500).json({ message: "Failed to load unit" });
    }
  });
}
