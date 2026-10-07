import type { FormEvent } from "react";
import type { Operation } from "../types/Operation";

type Props = {
  name: string;
  status: Operation["status"];
  priority: Operation["priority"];

  onNameChange: (value: string) => void;
  onStatusChange: (value: Operation["status"]) => void;
  onPriorityChange: (value: Operation["priority"]) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function OperationForm({
  name,
  status,
  priority,
  onNameChange,
  onStatusChange,
  onPriorityChange,
  onSubmit
}: Props) {

  return (
    <form onSubmit={onSubmit}>

      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Operation name"
      />

      <select
        value={status}
        onChange={(e) =>
          onStatusChange(
            e.target.value as Operation["status"]
          )
        }
      >
        <option value="Planned">Planned</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        value={priority}
        onChange={(e) =>
          onPriorityChange(
            e.target.value as Operation["priority"]
          )
        }
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <button type="submit">
        Add
      </button>

    </form>
  );
}

export default OperationForm;