import { useState } from "react";
import OperationCard from "../components/operation/OperationCard";
import OperationForm from "../components/operation/OperationForm";
import OperationFilter from "../components/operation/OperationFilter";
import type { Operation, StatusFilter, PriorityFilter} from "../types/Operation";
import "./styles/Operations.css";



function Operations() {
    const [operations, setOperations] = useState<Operation[]>([
      
     { id: 1, name: "Operation Alpha", status: "In Progress", priority: "High" },
     { id: 2, name: "Operation Bravo", status: "Completed", priority: "Low" },
     { id: 3, name: "Operation Charlie", status: "Planned", priority: "Medium" },
  ]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Operation["status"]>("Planned");
  const [priority, setPriority] = useState<Operation["priority"]>("Low");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");
  

  const filteredOperations = operations.filter(operation => {
  const statusMatches =
    statusFilter === "All" ||
    operation.status === statusFilter;

  const priorityMatches =
    priorityFilter === "All" ||
    operation.priority === priorityFilter;

  const searchMatches = operation.name.toLowerCase().includes(search.toLowerCase());

  return statusMatches && priorityMatches && searchMatches;
});

// Functions

// Function to add a new operation
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


// Function to delete an operation
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


// Function to change the priority of an operation
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
  <section className="operations-page">
    <h1>Operations</h1>

    <button className="btn btn-add" onClick={() => setShowForm(prev => !prev)}>
      {showForm ? "Close" : "Add Operation"}
    </button>

    {showForm && (
      <OperationForm
        name={name}
        status={status}
        priority={priority}

        onNameChange={setName}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}

        onSubmit={addOperation}
      />
    )}
    {statusFilter && priorityFilter && (
      <OperationFilter
        search={search}
        status={statusFilter}
        priority={priorityFilter}
        setSearch={setSearch}
        filterStatus={setStatusFilter}
        filterPriority={setPriorityFilter}
      />
    )}

    {filteredOperations.length === 0 && (
      <p>No operations found</p>
    )}

    {filteredOperations.map(operation => (
      <OperationCard
        key={operation.id}
        operation={operation}
        onDelete={deleteOperation}
        onStatusChange={changeStatus}
        onPriorityChange={changePriority}
      />
    ))}
  </section>
);
}

export default Operations;
