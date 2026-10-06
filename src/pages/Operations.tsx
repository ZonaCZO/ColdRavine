type Operation = {
  id: number;
  name: string;
  status: "Planned" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
};

function OperationsCard({ operation }: { operation: Operation }) {
  return (
    <div className="operation-card">
      <h3>{operation.name}</h3>
      <p>Status: {operation.status}</p>
      <p className={`status-badge ${operation.priority.toLowerCase()}`}>
        {operation.priority}
      </p>
    </div>
  );
}

function Operations() {
  const operations: Operation[] = [
    { id: 1, name: "Operation Alpha", status: "In Progress", priority: "High" },
    { id: 2, name: "Operation Bravo", status: "Completed", priority: "Low" },
    { id: 3, name: "Operation Charlie", status: "Planned", priority: "Medium" },
  ];

    return (
        <section className="operations">
            <h1>OPERATIONS</h1>
            <div className="operations-grid">
                {operations.map((operation) => (
                    <OperationsCard key={operation.id} operation={operation} />
                ))}
            </div>
        </section>
    );
}

export default Operations;