
import type { Soldier } from "../../types/Soldier";




function UnitPersonnel( { soldiers }: { soldiers: Soldier[]} ) {
  if (soldiers.length === 0) return (<p className="unit-details-empty">Personnel list has not been connected yet.</p> )
  return (
    <section className="unit-details-panel" aria-labelledby="unit-personnel-title">
      
      <h2 id="unit-personnel-title">Personnel</h2>
      {soldiers.map((soldier) => (
      <div key={soldier.id} className="unit-personnel-fields">
        <div className="unit-personnel-field"><span>Record ID</span><p>#{soldier.id}</p></div>
        <div className="unit-personnel-field"><span>Name</span> <p>{soldier.name}</p></div>
        <div className="unit-personnel-field"><span>Rank</span><p>{soldier.rank}</p></div>
        <div className="unit-personnel-field"><span>Specialization</span><p>{soldier.specialization}</p></div>
      </div>
      ))}
      
    </section>
  );
}

export default UnitPersonnel;
