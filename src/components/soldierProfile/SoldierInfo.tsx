import type { Soldier } from "../../types/Soldier";

function SoldierInfo({ soldier }: { soldier: Soldier }) {
  return (
    <section className="soldier-profile-info" aria-labelledby="soldier-info-title">
      <h2 id="soldier-info-title">Personal information</h2>
      <dl className="soldier-profile-grid">
        <div><dt>Rank</dt><dd>{soldier.rank}</dd></div>
        <div><dt>Unit</dt><dd>{soldier.unit}</dd></div>
        <div><dt>Status</dt><dd>{soldier.status}</dd></div>
        <div><dt>Specialization</dt><dd>{soldier.specialization}</dd></div>
        <div><dt>Age</dt><dd>{soldier.age}</dd></div>
        <div><dt>Record ID</dt><dd>#{soldier.id}</dd></div>
      </dl>
    </section>
  );
}

export default SoldierInfo;
