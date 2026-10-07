import RecentActivity from "../components/dashboard/RecentActivity";
import StatCard from "../components/dashboard/StatCard";
import ActiveOperations from "../components/dashboard/ActiveOperations";
import './styles/Dashboard.css'
import SystemStatus from "../components/dashboard/SystemStatus";


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
      <StatCard key={index} title={stat.title} value={stat.value} />
    ))}
  </div>

  <div className="dashboard-grid">
      {recentActivity.map((activity, index) => (
        <RecentActivity key={index} activities={[activity]} />
      ))}

      {activeOperations.map((operation, index) => (
        <ActiveOperations key={index} operations={[operation]} />
      ))}

      {systemStatus.map((status, index) => (
        <SystemStatus key={index} statuses={[status]} />
      ))}

  </div>
</section>
  )
}

export default Dashboard