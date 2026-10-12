import MapCanvas from "../components/map/MapCanvas";
import MapObjectPanel from "../components/map/MapObjectPanel";
import "./styles/Modules.css";

function TacticalMap() {
  return (
    <section className="module-page">
      <h1>Tactical Map</h1>
      <p className="module-notice">Interface preview · Map and layers will be connected later.</p>
      <MapCanvas />
      <MapObjectPanel />
    </section>
  );
}

export default TacticalMap;
