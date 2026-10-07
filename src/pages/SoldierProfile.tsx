import type { Soldier } from "../types/Soldier";
import SoldierHeader from "../components/soldierProfile/SoldierHeader";
import SoldierInfo from "../components/soldierProfile/SoldierInfo";
import SoldierServiceRecord from "../components/soldierProfile/SoldierServiceRecord";
import SoldierActivity from "../components/soldierProfile/SoldierActivity";
import "./styles/SoldierProfile.css";

// Temporary preview. Replace with the shared array lookup during the useParams lesson.
const previewSoldier: Soldier = {
  id: 1, name: "John Doe", rank: "Private", unit: "Alpha",
  status: "Active", specialization: "Infantry", age: 25,
};

function SoldierProfile() {
  const soldier = previewSoldier;

  return (
    <section className="soldier-profile-page">
      <h1>Soldier dossier</h1>
      <SoldierHeader soldier={soldier} />
      <SoldierInfo soldier={soldier} />
      <div className="soldier-profile-sections">
        <SoldierServiceRecord />
        <SoldierActivity />
      </div>
    </section>
  );
}

export default SoldierProfile;
