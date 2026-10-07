import { units } from "../data/units";
import UnitHeader from "../components/unitDetails/UnitHeader";
import UnitInfo from "../components/unitDetails/UnitInfo";
import UnitPersonnel from "../components/unitDetails/UnitPersonnel";
import UnitCommander from "../components/unitDetails/UnitCommander";
import "./styles/UnitDetails.css";

function UnitDetails() {
  // Temporary preview. Replace with the ID lookup during the routing lesson.
  const unit = units[0];

  if (!unit) {
    return <p>No units available</p>;
  }

  return (
    <section className="unit-details-page">
      <h1>Unit details</h1>
      <UnitHeader unit={unit} />
      <UnitInfo unit={unit} />
      <div className="unit-details-sections">
        <UnitCommander />
        <UnitPersonnel />
      </div>
    </section>
  );
}

export default UnitDetails;
