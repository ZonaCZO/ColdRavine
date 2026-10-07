import { useState } from "react";
import type { Soldier } from "../types/Soldier";
import PersonnelCard from "../components/personnel/PersonnelCard";
import PersonnelFilter from "../components/personnel/PersonnelFilter";
import "./styles/Personnel.css";

const soldiers: Soldier[] = [
  { id: 1, name: "John Doe", rank: "Private", unit: "Alpha", status: "Active", specialization: "Infantry", age: 25 },
  { id: 2, name: "Jane Smith", rank: "Sergeant", unit: "Bravo", status: "Wounded", specialization: "Medic", age: 30 },
  { id: 3, name: "Mike Johnson", rank: "Corporal", unit: "Charlie", status: "Reserve", specialization: "Engineer", age: 28 },
];

const statuses = [...new Set(soldiers.map((soldier) => soldier.status))];
const units = [...new Set(soldiers.map((soldier) => soldier.unit))];

function Personnel() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Soldier["status"] | null>(null);
  const [unit, setUnit] = useState("");
  const query = search.trim().toLowerCase();

  const filteredSoldiers = soldiers.filter((soldier) =>
    soldier.name.toLowerCase().includes(query) &&
    (status === null || soldier.status === status) &&
    (unit === "" || soldier.unit === unit)
  );

  function resetFilters() {
    setSearch("");
    setStatus(null);
    setUnit("");
  }

  return (
    <section className="personnel-page">
      <div className="personnel-page__shell">
        <header className="personnel-header">
          <div className="personnel-header__top">
            <h1 className="personnel-header__title">Personnel</h1>
            <span className="personnel-badge">{soldiers.length} soldiers</span>
          </div>
          <PersonnelFilter
            search={search} onSearchChange={setSearch}
            status={status} onStatusChange={setStatus} statuses={statuses}
            unit={unit} onUnitChange={setUnit} units={units}
            onReset={resetFilters}
          />
        </header>
        <p className="personnel-subtitle" role="status">
          Showing {filteredSoldiers.length} of {soldiers.length} soldiers
        </p>
        {filteredSoldiers.length > 0 ? (
          <div className="personnel-cards personnel-directory">
            {filteredSoldiers.map((soldier) => (
              <PersonnelCard key={soldier.id} soldier={soldier} />
            ))}
          </div>
        ) : (
          <div className="personnel-section personnel-empty">
            <h2 className="personnel-section__title">No personnel found</h2>
            <p className="personnel-subtitle">Try another name or reset the filters.</p>
            <button type="button" className="personnel-button personnel-button--secondary" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Personnel;
