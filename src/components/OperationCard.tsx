
import type { Operation } from "../pages/Operations";

type Props = {
  operation: Operation;
  onDelete: (id: number) => void;
};

function OperationCard({ operation, onDelete }: Props) {
  return (
    <div>
      <h3>{operation.name}</h3>

      <button onClick={() => onDelete(operation.id)}>
        Delete
      </button>
    </div>
  );
}
export default OperationCard;