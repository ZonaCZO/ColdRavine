
import './Sidebar.css'
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

function Sidebar({ onLogout }: { onLogout: () => void }) {   
    const menuItems = [
  { icon: '▣', name: 'Dashboard' },
  { icon: '♟', name: 'Personnel' },
  { icon: '◉', name: 'Operations' },
  { icon: '◇', name: 'Units' },
  { icon: '▤', name: 'Intelligence' },
  { icon: '⬡', name: 'Tactical Map' },
  
]
const navigate = useNavigate();
const [loggingOut, setLoggingOut] = useState(false);
const [logoutError, setLogoutError] = useState("");

async function handleLogout() {
  setLoggingOut(true);
  setLogoutError("");
  onLogout();
  navigate("/login", { replace: true });

  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok && response.status !== 401) {
      throw new Error("Logout failed");
    }

    navigate("/login", { replace: true });
  } catch {
    setLogoutError("Не удалось выйти. Попробуйте снова.");
  } finally {
    setLoggingOut(false);
  }
}

    return (
    <aside id="sidebar">
        <section id="sidebar-logo">
            <div className="hero">

        </div>
        <div>
          <h2>SIDEBAR</h2>
          <p className="tech-text">SYSTEM ONLINE</p>

        </div>
       
      </section>
      <section id="sidebar-sections">
          {menuItems.map((item) => (
            <NavLink key={item.name} to={`/${item.name.toLowerCase().replace(' ', '-')}`} className={({ isActive }) => (isActive ? 'sidebar-section active' : 'sidebar-section')}>
              {item.icon} {item.name}
            </NavLink>
          ))}
      </section>
      <button
  className="sidebar-logout"
  type="button"
  onClick={handleLogout}
  disabled={loggingOut}
>
  {loggingOut ? "Signing out..." : "Sign out"}
</button>

{logoutError && <p role="alert">{logoutError}</p>}
    </aside>
    )
}
export default Sidebar