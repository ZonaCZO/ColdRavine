import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'
import { Dashboard, NotFound, Operations, Personnel, Units, Soldier, UnitDetails, Intelligence, ReportDetails, TacticalMap, Login} from "./pages/index.ts";


function App() {
  return (
  
    <section id="app">
      <Sidebar />
          
      <section id="center">
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/personnel" element={<Personnel />} />
            <Route path="/personnel/:id" element={<Soldier />} />
            <Route path="/units" element={<Units />} />
            <Route path="/units/:id" element={<UnitDetails />} />
            <Route path="/intelligence" element={<Intelligence />} />
            <Route path="/intelligence/:id" element={<ReportDetails />} />
            <Route path="/map" element={<TacticalMap />} />
            <Route path="/tactical-map" element={<TacticalMap />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        
      </section>
    </section>
  )
}

export default App
