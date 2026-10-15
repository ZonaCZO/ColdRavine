import type { Unit } from "../../types/Unit";

type Props = {
  search: string;
  status: Unit["status"] | null;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: Unit["status"] | null) => void;
  specialization: string;
  specializations: string[];
  onSpecializationChange: (value: string) => void;
  onReset: () => void;
};

function UnitFilter({ search, status, onSearchChange, onStatusChange, onReset, specialization, specializations, onSpecializationChange }: Props) {
  return (
    <div className="unit-filter">
      <input type="search" aria-label="Search units by name" placeholder="Search units..."
        value={search} onChange={(event) => onSearchChange(event.target.value)} />
      <select aria-label="Filter units by status" value={status ?? ""} onChange={(event) => {
        const value = event.target.value;
        onStatusChange(value === "Active" || value === "Reserve" ? value : null);
      }}>
        <option value="">All statuses</option>
        <option value="Active">Active</option>
        <option value="Reserve">Reserve</option>
      </select>
      <select aria-label="Filter units by specialization" value={specialization} onChange={event => onSpecializationChange(event.target.value)}><option value="">All specializations</option>{specializations.map(item => <option key={item}>{item}</option>)}</select>
      <button type="button" className="units-button" onClick={onReset}>Reset filters</button>
    </div>
  );
}

export default UnitFilter;
