import { useState } from "react";
import type { Unit } from "../types/Unit";
import UnitCard from "../components/unit/UnitCard";
import UnitFilter from "../components/unit/UnitFilter";
import { units } from "../data/units";
import "./styles/Units.css";


function Units() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Unit["status"] | null>(null);
  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(search.trim().toLowerCase()) &&
    (status === null || unit.status === status)
  );

  function resetFilters() {
    setSearch("");
    setStatus(null);
  }

  return (
    <section className="units-page">
      <h1>Units</h1>
      <UnitFilter search={search} status={status} onSearchChange={setSearch}
        onStatusChange={setStatus} onReset={resetFilters} />
      <p className="units-count" role="status">Showing {filteredUnits.length} of {units.length} units</p>
      {filteredUnits.length > 0 ? (
        <div className="units-grid">
          {filteredUnits.map((unit) => <UnitCard key={unit.id} unit={unit} />)}
        </div>
      ) : (
        <div className="units-empty">
          <h2>No units found</h2>
          <p>Try another name or reset the filters.</p>
          <button type="button" className="units-button" onClick={resetFilters}>Reset filters</button>
        </div>
      )}
    </section>
  );
}

export default Units;
