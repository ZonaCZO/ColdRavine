import type { Unit } from "../../types/Unit";

function UnitInfo({ unit, personnelCount }: { unit: Unit; personnelCount: number }) {
  return (
    <section className="unit-details-panel" aria-labelledby="unit-info-title">
      <h2 id="unit-info-title">Unit information</h2>
      <dl className="unit-details-grid">
        <div><dt>Specialization</dt><dd>{unit.specialization}</dd></div>
        <div><dt>Status</dt><dd>{unit.status}</dd></div>
        <div><dt>Personnel</dt><dd>{personnelCount}</dd></div>
        <div><dt>Record ID</dt><dd>#{unit.id}</dd></div>
      </dl>
    </section>
  );
}

export default UnitInfo;
