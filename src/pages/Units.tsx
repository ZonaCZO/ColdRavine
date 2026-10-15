import { useEffect, useState } from "react";
import type { Soldier } from "../types/Soldier";
import type { Unit } from "../types/Unit";
import UnitCard from "../components/unit/UnitCard";
import UnitFilter from "../components/unit/UnitFilter";
import "./styles/Units.css";


function Units() {
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [specialization, setSpecialization] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUnits() {
      try {
        const response = await fetch("/api/units");
        if (!response.ok) throw new Error("Failed to load units");
        const data: Unit[] = await response.json();
        const personnelResponse = await fetch("/api/soldiers");
        if (!personnelResponse.ok) throw new Error("Failed to load personnel");
        const personnelData: Soldier[] = await personnelResponse.json();
        if (active) { setUnits(data); setSoldiers(personnelData); }
      } catch {
        if (active) setError("Не удалось загрузить подразделения. Попробуйте позже.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUnits();
    return () => { active = false; };
  }, []);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Unit["status"] | null>(null);
  const filteredUnits = units.filter((unit) =>
    unit.name.toLowerCase().includes(search.trim().toLowerCase()) &&
    (status === null || unit.status === status) && (!specialization || unit.specialization === specialization)
  );

  function resetFilters() {
    setSearch("");
    setStatus(null);
    setSpecialization("");
  }

  return (
    <section className="units-page">
      <h1>Units</h1>
      <UnitFilter search={search} status={status} onSearchChange={setSearch}
        onStatusChange={setStatus} onReset={resetFilters}
        specialization={specialization} onSpecializationChange={setSpecialization} specializations={[...new Set(units.map(unit => unit.specialization))]} />
      {!loading && !error && <p className="units-count" role="status">Showing {filteredUnits.length} of {units.length} units</p>}
      {loading ? (
        <p role="status">Loading units...</p>
      ) : error ? (
        <p className="units-alert" role="alert">{error}</p>
      ) : filteredUnits.length > 0 ? (
        <div className="units-grid">
          {filteredUnits.map((unit) => <UnitCard key={unit.id} unit={unit} personnelCount={soldiers.filter(soldier => soldier.unit === unit.name).length} />)}
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

