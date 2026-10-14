// Use the existing in-memory units array from server/index.js.
export function registerUnitRoutes(app, units) {
  app.get("/api/units", (req, res) => {
    res.json(units);
  });

  app.get("/api/units/:id", (req, res) => {
    const unit = units.find((item) => item.id === Number(req.params.id));

    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.json(unit);
  });
}
