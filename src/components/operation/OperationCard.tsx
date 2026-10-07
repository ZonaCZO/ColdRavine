import { useState } from "react";
import type { Operation } from "../../types/Operation";


type Props = {
  operation: Operation;
  onDelete: (id: number) => void;
  onStatusChange: (
    id: number,
    status: Operation["status"]
  ) => void;
  onPriorityChange: (
    id: number,
    priority: Operation["priority"]
  ) => void;
};

function OperationCard({
  operation,
  onDelete,
  onStatusChange,
  onPriorityChange
}: Props) {

  const [editing, setEditing] = useState(false);

  return (
    <div className="operation-card">
      <h3>{operation.name}</h3>

      <p>Status: {operation.status}</p>
      <p>Priority: {operation.priority}</p>

      <button className="btn btn-edit" onClick={() => setEditing(prev => !prev)}>
        {editing ? "Close" : "Edit"}
      </button>

      {editing && (
        <div className="operation-controls">

          <select
            value={operation.status}
            onChange={(e) =>
              onStatusChange(
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
              onPriorityChange(
                operation.id,
                e.target.value as Operation["priority"]
              )
            }
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button className="btn btn-delete" onClick={() => onDelete(operation.id)}>
            Delete
          </button>

        </div>
      )}
    </div>
  );
}

export default OperationCard;