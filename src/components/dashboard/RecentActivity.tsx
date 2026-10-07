type Activity = {
  title: string;
  time: string;
};

type Props = {
  activities: Activity[];
};

function RecentActivity({ activities }: Props) {
  return (
    <section className="dashboard-panel">
      <h2>Recent Activity</h2>

      {activities.map((activity, index) => (
        <div key={index} className="activity-card">
          <h3>{activity.title}</h3>
          <p>{activity.time}</p>
        </div>
      ))}
    </section>
  );
}

export default RecentActivity;