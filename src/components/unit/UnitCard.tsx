import type { Unit } from "../../types/Unit";

function UnitCard({ unit }: { unit: Unit }) {
  return (
    <article className="unit-card">
      <svg className="unit-emblem" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3 20 6v6c0 4-4 7-8 9-4-2-8-5-8-9V6Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="m8 12 3 3 5-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <h2>{unit.name}</h2>
      <span className={`unit-status unit-status--${unit.status.toLowerCase()}`}>{unit.status}</span>
      <p>{unit.specialization}</p>
    </article>
  );
}

export default UnitCard;
