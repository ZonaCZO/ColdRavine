import { Navigate, Route, Routes, useLocation} from 'react-router-dom'
import type { User } from './types/User.ts';
import './App.css'
import Sidebar from './components/Sidebar'
import { Dashboard, NotFound, Operations, Personnel, Units, Soldier, UnitDetails, Intelligence, ReportDetails, TacticalMap, Login, OperationDetails} from "./pages/index.ts";
import { useEffect, useState } from 'react';



function App() {
  const { pathname } = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState("");
  const isLoginPage = pathname === "/login";

  useEffect(() =>{
      async function checkSession() {
        setCheckingSession(true);
        setSessionError("");
      
       
      try{
        const response = await fetch("/api/auth/me");
        if (response.status === 401){
          setUser(null);
          return;
        }
        if (!response.ok){
          throw new Error ("Error with authentification")
        }
        const data = await response.json();
        setUser(data)
      } catch{
        setSessionError("Error with authentification");
      } finally {
        setCheckingSession(false);
      }
    }

    checkSession();
  }, []);

  if (checkingSession) {
  return <p>Checking session...</p>;
}

if (sessionError) {
  return <p role="alert">{sessionError}</p>;
}

  return (
  
    <section id="app">
      {user && !isLoginPage && <Sidebar onLogout={() => setUser(null)} />}
          
      <section id="center" className={isLoginPage ? "center-login" : ""}>
  <Routes>
    <Route
      path="/"
      element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
    />
    <Route
      path="/login"
      element={
        user
          ? <Navigate to="/dashboard" replace />
          : <Login onLogin={setUser} />
      }
    />
    <Route path="*" element={user ? <NotFound /> : <Navigate to="/login" replace />} />
    <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
    <Route path="/operations/:id" element={user ? <OperationDetails /> : <Navigate to="/login" replace />} />
    <Route path="/operations" element={user ? <Operations /> : <Navigate to="/login" replace />} />
    <Route path="/personnel" element={user ? <Personnel /> : <Navigate to="/login" replace />} />
    <Route path="/personnel/:id" element={user ? <Soldier /> : <Navigate to="/login" replace />} />
    <Route path="/units" element={user ? <Units /> : <Navigate to="/login" replace />} />
    <Route path="/units/:id" element={user ? <UnitDetails /> : <Navigate to="/login" replace />} />
    <Route path="/intelligence" element={user ? <Intelligence /> : <Navigate to="/login" replace />} />
    <Route path="/intelligence/:id" element={user ? <ReportDetails /> : <Navigate to="/login" replace />} />
    <Route path="/map" element={user ? <TacticalMap /> : <Navigate to="/login" replace />} />
    <Route path="/tactical-map" element={user ? <TacticalMap /> : <Navigate to="/login" replace />} />
  </Routes>
</section>
    </section>
  )
}

export default App
