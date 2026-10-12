import { Link, useParams } from "react-router-dom";
import { reports } from "../data/reports";
import "./styles/Modules.css";

function ReportDetails() {
  const { id } = useParams();
  const report = reports.find((item) => item.id === Number(id));

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
