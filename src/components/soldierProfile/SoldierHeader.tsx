import type { Soldier } from "../../types/Soldier";

function SoldierHeader({ soldier }: { soldier: Soldier }) {
  return (
    <header className="soldier-profile-header">
      <svg className="soldier-profile-avatar" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM6.5 8A4.5 4.5 0 0 0 2 12.5v.5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-.5A4.5 4.5 0 0 0 9.5 8Z" fill="currentColor" />
      </svg>
      <h2>{soldier.name}</h2>
      <p>{soldier.rank} · {soldier.unit}</p>
      <span className={`soldier-profile-status soldier-profile-status--${soldier.status.toLowerCase()}`}>
        {soldier.status}
      </span>
    </header>
  );
}

export default SoldierHeader;
