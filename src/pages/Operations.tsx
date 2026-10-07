import { useState } from "react";
import OperationCard from "../components/OperationCard";
import OperationForm from "../components/OperationForm";
import type { Operation } from "../types/Operation";



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
  <section>
    <h1>Operations</h1>

    <button onClick={() => setShowForm(prev => !prev)}>
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

    {operations.length === 0 && (
      <p>No operations found</p>
    )}

    {operations.map(operation => (
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
