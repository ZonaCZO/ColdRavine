import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { IntelligenceReport } from "../types/Intelligence";
import "./styles/Modules.css";

function ReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState<IntelligenceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    async function loadReport() {
      setLoading(true); setError(""); setReport(null);
      try {
        const response = await fetch("/api/intelligence/" + id);
        if (response.status === 404) return;
        if (!response.ok) throw new Error("Failed to load report");
        const data: IntelligenceReport = await response.json();
        if (active) setReport(data);
      } catch { if (active) setError("Failed to load report"); }
      finally { if (active) setLoading(false); }
    }
    loadReport();
    return () => { active = false; };
  }, [id]);
  if (loading) return <section className="module-page"><p role="status">Loading report...</p></section>;
  if (error) return <section className="module-page"><p className="module-alert" role="alert">{error}</p></section>;

  if (!report) {
    return <section className="module-page"><h1>Report not found</h1><Link className="module-link" to="/intelligence">Back to intelligence</Link></section>;
  }

  return (
    <section className="module-page">
      <Link className="module-link" to="/intelligence">← Intelligence</Link>
      <h1>{report.title}</h1>
      <section className="module-panel">
        <h2>Report information</h2>
        <dl className="module-facts">
          <div><dt>Author</dt><dd>{report.author}</dd></div>
          <div><dt>Date</dt><dd><time dateTime={report.date}>{report.date}</time></dd></div>
          <div><dt>Type</dt><dd>{report.type}</dd></div>
          <div><dt>Threat</dt><dd>{report.threat}</dd></div>
          <div><dt>Location</dt><dd>{report.location}</dd></div>
        </dl>
      </section>
      <section className="module-panel"><h2>Description</h2><p>{report.description}</p></section>
      <section className="module-panel"><h2>Attachments</h2><p>No attachments yet.</p></section>
    </section>
  );
}

export default ReportDetails;
