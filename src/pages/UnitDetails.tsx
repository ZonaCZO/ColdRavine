import { units } from "../data/units";
import UnitHeader from "../components/unitDetails/UnitHeader";
import UnitInfo from "../components/unitDetails/UnitInfo";
import UnitPersonnel from "../components/unitDetails/UnitPersonnel";
import UnitCommander from "../components/unitDetails/UnitCommander";
import "./styles/UnitDetails.css";
import { useParams } from "react-router-dom";
import { soldiers } from "../data/soldiers";

function UnitDetails() {
  const params = useParams();
  // Temporary preview. Replace with the ID lookup during the routing lesson.
  const unit = units.find(s => s.id === Number(params.id));

  if (!unit) {
    return <p>No units available</p>;
  }

  return (
    <section className="unit-details-page">
      <h1>Unit details</h1>
      <UnitHeader unit={unit} />
      <UnitInfo unit={unit} />
      <div className="unit-details-sections">
        <UnitCommander soldier={soldiers.find(s => s.id === unit.commander)}/>
        <UnitPersonnel soldiers={soldiers.filter(s => s.unit === unit.name)} />
      </div>
    </section>
  );
}

export default UnitDetails;
