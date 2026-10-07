import { soldiers } from "../data/soldiers";
import SoldierHeader from "../components/soldierProfile/SoldierHeader";
import SoldierInfo from "../components/soldierProfile/SoldierInfo";
import SoldierServiceRecord from "../components/soldierProfile/SoldierServiceRecord";
import SoldierActivity from "../components/soldierProfile/SoldierActivity";
import "./styles/SoldierProfile.css";
import { useParams } from "react-router-dom";

// Temporary preview. Replace with the shared array lookup during the useParams lesson.


function SoldierProfile() {
  const params = useParams();

  const soldier = soldiers.find(s => s.id === Number(params.id))

  if (!soldier) return (<section className="soldier-profile-page">
      <h1>Soldier dossier</h1>
      Soldier not found
      </section>
      )
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
