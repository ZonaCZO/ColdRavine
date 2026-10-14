import type { Soldier } from "../types/Soldier";
import SoldierHeader from "../components/soldierProfile/SoldierHeader";
import SoldierInfo from "../components/soldierProfile/SoldierInfo";
import SoldierServiceRecord from "../components/soldierProfile/SoldierServiceRecord";
import SoldierActivity from "../components/soldierProfile/SoldierActivity";
import "./styles/SoldierProfile.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

// Temporary preview. Replace with the shared array lookup during the useParams lesson.


function SoldierProfile() {
  const {id} = useParams();
  const [soldier, setSoldier] = useState<Soldier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  
  useEffect(() => {
    async function loadSoldiers() {
      setLoading(true);
      setError("");
      setSoldier(null);
  
      try {
        const response = await fetch(`/api/soldiers/${id}`);
        if (!response.ok) {
          throw new Error("Failed to load personnel");
        }
        const data = await response.json();
        
        setSoldier(data);
      } catch {
          setError("Failed to load personnel")
      } finally {
        setLoading(false);
      }
    }
  
      
    loadSoldiers();
  }, [id]);

  
  return (
    <section className="soldier-profile-page">
      <h1>Soldier dossier</h1>
    {loading ? (
      <p>Loading soldier...</p>
    ) : error ? (
      <p className="personnel-alert" role="alert">{error}</p>
    ) : !soldier ?(
      <p>Soldier not found</p>
    ) : (
      <><SoldierHeader soldier={soldier} /><SoldierInfo soldier={soldier} /><div className="soldier-profile-sections">
              <SoldierServiceRecord />
              <SoldierActivity />
            </div></>
  )}
  </section>
)
}


export default SoldierProfile;
