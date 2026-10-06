
import './Sidebar.css'
import { NavLink } from "react-router-dom";

function Sidebar() {   
    const menuItems = [
  { icon: '▣', name: 'Dashboard' },
  { icon: '♟', name: 'Personnel' },
  { icon: '◉', name: 'Operations' },
  { icon: '◇', name: 'Units' },
  { icon: '▤', name: 'Intelligence' },
  { icon: '⬡', name: 'Tactical Map' },
  
]

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
            <NavLink key={item.name} to={`/${item.name.toLowerCase().replace(' ', '-')}`} className="{({ isActive }) => (isActive ? 'sidebar-section active' : 'sidebar-section')}">
              {item.icon} {item.name}
            </NavLink>
          ))}
      </section>
    </aside>
    )
}
export default Sidebar