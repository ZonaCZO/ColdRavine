import type { Soldier } from "../../types/Soldier";

function UnitCommander({ soldier }: { soldier: Soldier | undefined}) {

  if (!soldier) return (<p className="unit-details-empty">No сommander assigned</p>);
  return (
    <section className="unit-details-panel" aria-labelledby="unit-commander-title">
      <h2 id="unit-commander-title">Commander</h2>
      
      <div className="unit-personnel-fields">
        <div className="unit-personnel-field"><span>Record ID</span><p>#{soldier.id}</p></div>
        <div className="unit-personnel-field"><span>Name</span> <p>{soldier.name}</p></div>
        <div className="unit-personnel-field"><span>Rank</span><p>{soldier.rank}</p></div>
        <div className="unit-personnel-field"><span>Specialization</span><p>{soldier.specialization}</p></div>
      </div>
      
    </section>
  );
}

export default UnitCommander;
