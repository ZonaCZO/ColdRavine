import { useEffect, useState } from "react";
import ReportCard from "../components/intelligence/ReportCard";
import ReportFilter from "../components/intelligence/ReportFilter";
import type { IntelligenceReport } from "../types/Intelligence";
import "./styles/Modules.css";

function Intelligence() {
  const [reports, setReports] = useState<IntelligenceReport[]>([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [threat, setThreat] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    async function loadReports() {
      try {
        const response = await fetch("/api/intelligence");
        if (!response.ok) throw new Error("Failed to load reports");
        const data: IntelligenceReport[] = await response.json();
        if (active) setReports(data);
      } catch { if (active) setError("Failed to load reports"); }
      finally { if (active) setLoading(false); }
    }
    loadReports();
    return () => { active = false; };
  }, []);
  const types = [...new Set(reports.map(report => report.type))];
  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(search.trim().toLowerCase()) &&
    (!type || report.type === type) && (!threat || report.threat === threat) && (!date || report.date === date)
  );
  function resetFilters() { setSearch(""); setType(""); setThreat(""); setDate(""); }
  return <section className="module-page">
    <h1>Intelligence</h1>
    <p className="module-notice">Demonstration reports</p>
    <ReportFilter search={search} type={type} threat={threat} date={date} types={types} onSearchChange={setSearch} onTypeChange={setType} onThreatChange={setThreat} onDateChange={setDate} onReset={resetFilters} />
    {loading ? <p role="status">Loading reports...</p> : error ? <p className="module-alert" role="alert">{error}</p> : <>
      <p role="status">Showing {filteredReports.length} of {reports.length} reports</p>
      {filteredReports.length ? <div className="module-grid">{filteredReports.map(report => <ReportCard key={report.id} report={report} />)}</div> : <section className="module-panel"><h2>No reports found</h2><p>Try another search or reset the filters.</p></section>}
    </>}
  </section>;
}
export default Intelligence;
