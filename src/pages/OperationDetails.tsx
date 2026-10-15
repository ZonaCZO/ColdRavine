import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Operation } from "../types/Operation";
import "./styles/Operations.css";

function OperationDetails() {
  const { id } = useParams();
  const [operation, setOperation] = useState<Operation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    async function loadOperation() {
      setLoading(true); setError(""); setOperation(null);
      try {
        const response = await fetch("/api/operations/" + id);
        if (response.status === 404) return;
        if (!response.ok) throw new Error("Failed to load operation");
        const data: Operation = await response.json();
        if (active) setOperation(data);
      } catch { if (active) setError("Failed to load operation"); }
      finally { if (active) setLoading(false); }
    }
    loadOperation();
    return () => { active = false; };
  }, [id]);
  return <section className="operations-page">
    <Link className="operation-details-link" to="/operations">← Operations</Link>
    <h1>Operation details</h1>
    {loading ? <p role="status">Loading operation...</p> : error ? <p className="operations-alert" role="alert">{error}</p> : !operation ? <p>Operation not found</p> :
      <article className="operation-card"><h2>{operation.name}</h2><p>Status: {operation.status}</p><p>Priority: {operation.priority}</p><p>Record ID: #{operation.id}</p></article>}
  </section>;
}
export default OperationDetails;
