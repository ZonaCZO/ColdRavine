type systemStatus = {
  title: string;
  value: string;
};

type Props = {
  statuses: systemStatus[];
};

function SystemStatus({ statuses }: Props) {
  return (
    <section className="dashboard-panel system-panel">
      <h2>System Status <span className="live-indicator">LIVE</span></h2>
      {statuses.map((status, index) => (
        <div key={index} className="system-status-card">
          <h3>{status.title}</h3>
          <p>{status.value}</p>
        </div>
      ))}
    </section>
  );
}
export default SystemStatus;