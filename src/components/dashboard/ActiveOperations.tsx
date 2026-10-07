

type operation = {
  title: string;
  status: string;
  priority: string;
};

type Props = {
  operations: operation[];
};

function ActiveOperations({ operations }: Props) {
  return (
    <section className="dashboard-panel">
      <h2>Active Operations</h2>

      {operations.map((operation, index) => (
        <div key={index} className="operation-card">
          <h3>{operation.title}</h3>
          <p>Status: {operation.status}</p>
          <p className={`status-badge ${operation.priority.toLowerCase()}`}>
              {operation.priority}
          </p>
        </div>
      ))}
    </section>
  );
}
export default ActiveOperations;