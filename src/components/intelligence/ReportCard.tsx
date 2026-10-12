import { Link } from "react-router-dom";
import type { IntelligenceReport } from "../../types/Intelligence";

function ReportCard({ report }: { report: IntelligenceReport }) {
  return (
    <Link className="module-panel module-report-card" to={`/intelligence/${report.id}`}>
      <span className="module-tag">{report.type}</span>
      <h2>{report.title}</h2>
      <p>{report.location}</p>
      <p>Threat: {report.threat}</p>
      <span className="module-link">Open report →</span>
    </Link>
  );
}

export default ReportCard;
