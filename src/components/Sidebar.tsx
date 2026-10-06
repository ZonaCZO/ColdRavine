
import './Sidebar.css'

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
            <button key={item.name} className="sidebar-section">
              {item.icon} {item.name}
            </button>
        
          ))}
        
      </section>
    </aside>
    )
}
export default Sidebar