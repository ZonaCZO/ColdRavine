import { useEffect, useState } from "react";
import StatCard from "../components/dashboard/StatCard";
import ActiveOperations from "../components/dashboard/ActiveOperations";
import type { Soldier } from "../types/Soldier";
import type { Unit } from "../types/Unit";
import type { Operation } from "../types/Operation";
import type { IntelligenceReport } from "../types/Intelligence";
import "./styles/Dashboard.css";

function Dashboard() {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [reports, setReports] = useState<IntelligenceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      try {
        const soldiersResponse = await fetch("/api/soldiers");
        if (!soldiersResponse.ok) throw new Error("Failed to load personnel");
        const soldierData: Soldier[] = await soldiersResponse.json();
        const unitsResponse = await fetch("/api/units");
        if (!unitsResponse.ok) throw new Error("Failed to load units");
        const unitData: Unit[] = await unitsResponse.json();
        const operationsResponse = await fetch("/api/operations");
        if (!operationsResponse.ok) throw new Error("Failed to load operations");
        const operationData: Operation[] = await operationsResponse.json();
        const reportsResponse = await fetch("/api/intelligence");
        if (!reportsResponse.ok) throw new Error("Failed to load reports");
        const reportData: IntelligenceReport[] = await reportsResponse.json();
        if (active) { setSoldiers(soldierData); setUnits(unitData); setOperations(operationData); setReports(reportData); }
      } catch { if (active) setError("Не удалось загрузить сводку. Попробуйте позже."); }
      finally { if (active) setLoading(false); }
    }
    loadDashboard();
    return () => { active = false; };
  }, []);
  const activeOperations = operations.filter(operation => operation.status === "In Progress");
  const stats = [
    { title: "Active Operations", value: activeOperations.length },
    { title: "Personnel", value: soldiers.length },
    { title: "Units", value: units.length },
    { title: "High Threat Reports", value: reports.filter(report => report.threat === "High" || report.threat === "Critical").length },
  ];
  return <section className="dashboard">
    <h1>DASHBOARD</h1>
    {loading ? <p role="status">Loading dashboard...</p> : error ? <p className="dashboard-alert" role="alert">{error}</p> : <>
      <div className="stats-grid">{stats.map(stat => <StatCard key={stat.title} title={stat.title} value={stat.value} />)}</div>
      <div className="dashboard-grid">
        <ActiveOperations operations={activeOperations.map(operation => ({ title: operation.name, status: operation.status, priority: operation.priority }))} />
        <section className="dashboard-panel"><h2>Recent activity</h2><p>No activity history yet.</p></section>
        <section className="dashboard-panel system-panel"><h2>Data source</h2><p>Express API · Temporary server data</p></section>
      </div>
    </>}
  </section>;
}
export default Dashboard;
