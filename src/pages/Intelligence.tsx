import ReportCard from "../components/intelligence/ReportCard";
import { reports } from "../data/reports";
import "./styles/Modules.css";

function Intelligence() {
  return (
    <section className="module-page">
      <h1>Intelligence</h1>
      <p className="module-notice">Demo reports · Search and filters will be added later.</p>
      <div className="module-grid">
        {reports.map((report) => <ReportCard key={report.id} report={report} />)}
      </div>
    </section>
  );
}

export default Intelligence;
