import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Unit } from "../types/Unit";
import type { Soldier } from "../types/Soldier";
import UnitHeader from "../components/unitDetails/UnitHeader";
import UnitInfo from "../components/unitDetails/UnitInfo";
import UnitPersonnel from "../components/unitDetails/UnitPersonnel";
import UnitCommander from "../components/unitDetails/UnitCommander";
import "./styles/UnitDetails.css";

function UnitDetails() {
  const { id } = useParams();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Ignore a previous request if the user leaves or opens another unit.
    let active = true;

    async function loadUnit() {
      setLoading(true);
      setError("");
      setUnit(null);
      setSoldiers([]);

      try {
        const response = await fetch(`/api/units/${id}`);
        if (response.status === 404) return;
        if (!response.ok) throw new Error("Failed to load unit");
        const unitData: Unit = await response.json();

        const soldiersResponse = await fetch("/api/soldiers");
        if (!soldiersResponse.ok) throw new Error("Failed to load personnel");
        const soldiersData: Soldier[] = await soldiersResponse.json();

        if (active) {
          setUnit(unitData);
          setSoldiers(soldiersData);
        }
      } catch {
        if (active) setError("Не удалось загрузить подразделение и его состав. Попробуйте позже.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUnit();
    return () => { active = false; };
  }, [id]);

  const commander = unit
    ? soldiers.find((soldier) => soldier.id === unit.commander)
    : undefined;
  const members = unit
    ? soldiers.filter((soldier) => soldier.unit === unit.name && soldier.id !== unit.commander)
    : [];

  return (
    <section className="unit-details-page">
      <h1>Unit details</h1>
      {loading ? (
        <p role="status">Loading unit...</p>
      ) : error ? (
        <p className="unit-details-alert" role="alert">{error}</p>
      ) : !unit ? (
        <p>Unit not found</p>
      ) : (
        <>
          <UnitHeader unit={unit} />
          <UnitInfo unit={unit} personnelCount={soldiers.filter(soldier => soldier.unit === unit.name).length} />
          <div className="unit-details-sections">
            <UnitCommander soldier={commander} />
            <UnitPersonnel soldiers={members} />
          </div>
        </>
      )}
    </section>
  );
}

export default UnitDetails;
