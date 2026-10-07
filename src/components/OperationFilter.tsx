
import type { Operation, PriorityFilter, StatusFilter} from "../types/Operation";

type Props = {

  status: StatusFilter;
  priority: PriorityFilter;

  filterStatus: (status: StatusFilter) => void;
  filterPriority: (priority: PriorityFilter) => void;
};

function OperationFilter({ status, priority, filterStatus, filterPriority }: Props) { return (

    <div className="filter-select">
      <select className="filter-form" value={status} onChange={(e) => filterStatus(e.target.value as Operation["status"])}>
        <option value="All">All</option>
        <option value="Planned">Planned</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <select value={priority} onChange={(e) => filterPriority(e.target.value as Operation["priority"])}>
        <option value="All">All</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div> 

)}
export default OperationFilter;


    