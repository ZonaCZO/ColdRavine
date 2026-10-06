import StatCard from "../components/StatCard";
import './Dashboard.css'


function Dashboard() {
    const stats = [
        { title: "Active Operations", value: 4 },
        { title: "Personnel", value: 128 },
        { title: "Units", value: 12 },
        { title: "Alerts", value: 3 },
    ];
    const recentActivity = [
        { title: "New Incident Reported", time: "2 minutes ago" },
        { title: "Resource Allocation Updated", time: "1 hour ago" },
    ];
    const activeOperations = [
        { title: "Operation Alpha", status: "In Progress", priority: "High" },
        { title: "Operation Bravo", status: "Completed", priority: "Low" },
    ];
    const systemStatus = [
        { title: "System Health", value: "Good" },
        { title: "Network Status", value: "Stable" },
    ];
  return (
<section className="dashboard">
  <h1>DASHBOARD</h1>

  <div className="stats-grid">
    {stats.map((stat, index) => (
      <StatCard
        key={index}
        title={stat.title}
        value={stat.value}
      />
    ))}
  </div>

  <div className="dashboard-grid">
    <section className="dashboard-panel">
      <h2>Recent Activity</h2>

      {recentActivity.map((activity, index) => (
        <div key={index} className="activity-card">
          <h3>{activity.title}</h3>
          <p>{activity.time}</p>
        </div>
      ))}
    </section>

    <section className="dashboard-panel">
      <h2>Active Operations</h2>

      {activeOperations.map((operation, index) => (
        <div key={index} className="operation-card">
          <h3>{operation.title}</h3>
          <p>Status: {operation.status}</p>
          <p className={`status-badge ${operation.priority.toLowerCase()}`}>
              {operation.priority}
          </p>
        </div>
      ))}
    </section>

    <section className="dashboard-panel system-panel">
      <h2>System Status <span className="live-indicator">LIVE</span></h2>

      {systemStatus.map((status, index) => (
        <div key={index} className="system-status-card">
          <h3>{status.title}</h3>
          <p>{status.value}</p>
        </div>
      ))}
    </section>
  </div>
</section>
  )
}

export default Dashboard