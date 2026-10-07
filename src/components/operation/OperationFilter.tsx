
import type { Operation, PriorityFilter, StatusFilter} from "../../types/Operation";

type Props = {

  search: string;
  status: StatusFilter;
  priority: PriorityFilter;

  setSearch: (search: string) => void;
  filterStatus: (status: StatusFilter) => void;
  filterPriority: (priority: PriorityFilter) => void;
};

function OperationFilter({ search, status, priority, setSearch, filterStatus, filterPriority }: Props) { return (

    <div className="operation-filter">
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search operations..."
      />
      <select value={status} onChange={(e) => filterStatus(e.target.value as Operation["status"])}>
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


    