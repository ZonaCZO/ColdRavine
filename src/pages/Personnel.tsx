import { useState, useEffect } from "react";
import type { Soldier } from "../types/Soldier";
import PersonnelCard from "../components/personnel/PersonnelCard";
import PersonnelFilter from "../components/personnel/PersonnelFilter";
import "./styles/Personnel.css";



function Personnel() {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Soldier["status"] | null>(null);
  const [unit, setUnit] = useState("");
  const [rank, setRank] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = search.trim().toLowerCase();

  const filteredSoldiers = soldiers.filter((soldier) =>
    soldier.name.toLowerCase().includes(query) &&
    (status === null || soldier.status === status) &&
    (unit === "" || soldier.unit === unit) &&
    (rank === "" || soldier.rank === rank)
  );

  useEffect(() => {
    async function loadSoldiers() {
    
      try {
        const response = await fetch("/api/soldiers");
        if (!response.ok) {
          throw new Error("Failed to load personnel");
        }
        const data = await response.json();
        if (response.status === 404) {
          return;
        }
        setSoldiers(data);
      } catch {
          setError("Failed to load personnel")
      } finally {
        setLoading(false);
      }
    }

    
    loadSoldiers();
  }, []);

  const statuses = [...new Set(soldiers.map((soldier) => soldier.status))];
  const units = [...new Set(soldiers.map((soldier) => soldier.unit))];

  const ranks = [...new Set(soldiers.map((soldier) => soldier.rank))];

  function resetFilters() {
    setSearch("");
    setStatus(null);
    setUnit("");
    setRank("");
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
            rank={rank} onRankChange={setRank} ranks={ranks}
            onReset={resetFilters}
          />
        </header>
        {!loading && !error && <p className="personnel-subtitle" role="status">
          Showing {filteredSoldiers.length} of {soldiers.length} soldiers
        </p>}
        {loading ? (
          <p role="status">Loading personnel...</p>
        ) : error ? (
          <p className="personnel-alert" role="alert">{error}</p>
        ) : filteredSoldiers.length === 0 ? (
          <div className="personnel-section personnel-empty">
            <h2 className="personnel-section__title">No personnel found</h2>
            <p className="personnel-subtitle">Try another name or reset the filters.</p>
            <button type="button" className="personnel-button personnel-button--secondary" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        ) : (
            <div className="personnel-cards personnel-directory">
            {filteredSoldiers.map((soldier) => (
              <PersonnelCard key={soldier.id} soldier={soldier} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Personnel;
