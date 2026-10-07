import type { Soldier } from "../../types/Soldier";

type PersonnelFilterProps = {
  search: string;
  onSearchChange: (value: string) => void;
  status: Soldier["status"] | null;
  onStatusChange: (value: Soldier["status"] | null) => void;
  statuses: Soldier["status"][];
  unit: string;
  onUnitChange: (value: string) => void;
  units: string[];
  onReset: () => void;
};

function PersonnelFilter({ search, onSearchChange, status, onStatusChange, statuses, unit, onUnitChange, units, onReset }: PersonnelFilterProps) {
  return (
    <div className="personnel-section personnel-filters">
      <div className="personnel-filters__fields">
        <label className="personnel-filter-field">
          <span className="personnel-info__label">Search by name</span>
          <input type="search" value={search} placeholder="Search soldier..."
            onChange={(event) => onSearchChange(event.target.value)} />
        </label>
        <label className="personnel-filter-field personnel-filter-field--select">
          <span className="personnel-info__label">Status</span>
          <select value={status ?? ""} onChange={(event) => {
            const selected = statuses.find((item) => item === event.target.value);
            onStatusChange(selected ?? null);
          }}>
            <option value="">All statuses</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="personnel-filter-field">
          <span className="personnel-info__label">Unit</span>
          <select value={unit} onChange={(event) => onUnitChange(event.target.value)}>
            <option value="">All units</option>
            {units.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <button type="button" className="personnel-button personnel-button--secondary" onClick={onReset}>
          Reset filters
        </button>
      </div>
    </div>
  );
}

export default PersonnelFilter;
