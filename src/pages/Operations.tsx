import { useState } from "react";
import OperationCard from "../components/OperationCard";

export type Operation = {
  id: number;
  name: string;
  status: "Planned" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
};


function Operations() {
    const [operations, setOperations] = useState<Operation[]>([
      
 //   { id: 1, name: "Operation Alpha", status: "In Progress", priority: "High" },
   //  { id: 2, name: "Operation Bravo", status: "Completed", priority: "Low" },
   //  { id: 3, name: "Operation Charlie", status: "Planned", priority: "Medium" },
  ]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Operation["status"]>("Planned");
  const [priority, setPriority] = useState<Operation["priority"]>("Low");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  

  const addOperation = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const newOperation: Operation = {
    id: Date.now(),
    name,
    status,
    priority
  };

  setOperations(prev => [...prev, newOperation]);
};
  const deleteOperation = (id: number) => {
    setOperations(operations.filter(operation => operation.id !== id));
  }
  const changeStatus = (
  id: number,
  newStatus: Operation["status"]
) => {
  setOperations(
    operations.map(operation =>
      operation.id === id
        ? { ...operation, status: newStatus }
        : operation
    )
  );
};
  const changePriority = (
  id: number,
  newPriority: Operation["priority"]
) => {
  setOperations(
    operations.map(operation =>
      operation.id === id
        ? { ...operation, priority: newPriority }
        : operation
    )
  );
};
    return (
  <section>
    <h1>Operations</h1>
    <button onClick={() => setShowForm(!showForm)}>{showForm ? "Hide Form" : "Add Operation"}</button>
  {showForm && (
      <form onSubmit={addOperation}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />


  <select
    value={status}
    onChange={(e) =>
      setStatus(e.target.value as Operation["status"])
    }
  >
    <option value="Planned">Planned</option>
    <option value="In Progress">In Progress</option>
    <option value="Completed">Completed</option>
  </select>

  <select
    value={priority}
    onChange={(e) =>
      setPriority(e.target.value as Operation["priority"])
    }
  >
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>

  <button type="submit">Add</button>
</form>
  )}
    {operations.length === 0 && (
  <p>No operations found</p>
)}
    {operations.map(operation => (
      <div key={operation.id} className="operation-card">
        <h3>{operation.name}</h3>

        <p>Status: {operation.status}</p>
        <p>Priority: {operation.priority}</p>
        <button onClick={() => setEditingId(prev => prev === operation.id ? null : operation.id)}>
          Edit
        </button>
        {editingId === operation.id && (
        <div className="operation-controls">
        <OperationCard operation={operation} onDelete={deleteOperation} />
        <select
  value={operation.status}
  onChange={(e) =>
    changeStatus(
      operation.id,
      e.target.value as Operation["status"]
    )
  }
>
  <option value="Planned">Planned</option>
  <option value="In Progress">In Progress</option>
  <option value="Completed">Completed</option>
        </select>

        <select
  value={operation.priority}
  onChange={(e) =>
    changePriority(
      operation.id,
      e.target.value as Operation["priority"]
    )
  }
>
  <option value="Low">Low</option>
  <option value="Medium">Medium</option>
  <option value="High">High</option>
</select>
</div>
        )}
      </div>
    ))}
  </section>
);
}






export default Operations;
