const operations = [
  { id: 1, name: "Operation Alpha", status: "In Progress", priority: "High" },
  { id: 2, name: "Operation Bravo", status: "Completed", priority: "Low" },
  { id: 3, name: "Operation Charlie", status: "Planned", priority: "Medium" },
];
const reports = [
  { id: 1, title: "Northern sector observation", type: "Recon", threat: "Medium", location: "Northern sector", description: "Demo report. Observation details will be added here.", author: "Demo analyst", date: "2026-10-14" },
  { id: 2, title: "Route assessment", type: "Field Report", threat: "Low", location: "Eastern sector", description: "Demo report. Route assessment details will be added here.", author: "Demo observer", date: "2026-10-15" },
];

// Register after requireAuth. Data remains in memory until the server restarts.
export function registerReadRoutes(app) {
  app.get("/api/operations", (req, res) => res.json(operations));
  app.get("/api/operations/:id", (req, res) => {
    const operation = operations.find(item => item.id === Number(req.params.id));
    if (!operation) return res.status(404).json({ message: "Operation not found" });
    res.json(operation);
  });
  app.get("/api/intelligence", (req, res) => res.json(reports));
  app.get("/api/intelligence/:id", (req, res) => {
    const report = reports.find(item => item.id === Number(req.params.id));
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  });
}
