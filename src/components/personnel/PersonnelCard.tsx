import type { Soldier } from "../../types/Soldier";

function PersonnelCard({ soldier }: { soldier: Soldier }) {
  return (
    <article className="personnel-card personnel-directory-card">
      <div className="personnel-directory-card__header">
        <svg className="personnel-directory-avatar" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM6.5 8A4.5 4.5 0 0 0 2 12.5v.5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-.5A4.5 4.5 0 0 0 9.5 8Z" fill="currentColor" />
        </svg>
        <div className="personnel-identity">
          <h2 className="personnel-name">{soldier.name}</h2>
          <p className="personnel-role">{soldier.rank}</p>
        </div>
      </div>
      <span className={`personnel-pill personnel-directory-status personnel-directory-status--${soldier.status.toLowerCase()}`}>
        {soldier.status}
      </span>
      <dl className="personnel-list personnel-directory-details">
        <div className="personnel-list__item">
          <dt className="personnel-list__label">Unit</dt>
          <dd className="personnel-list__value">{soldier.unit}</dd>
        </div>
        <div className="personnel-list__item">
          <dt className="personnel-list__label">Specialization</dt>
          <dd className="personnel-list__value">{soldier.specialization}</dd>
        </div>
        <div className="personnel-list__item">
          <dt className="personnel-list__label">Age</dt>
          <dd className="personnel-list__value">{soldier.age}</dd>
        </div>
      </dl>
    </article>
  );
}

export default PersonnelCard;
