import { Route, Routes } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'
import { Dashboard, NotFound, Operations} from "./pages/index.ts";


function App() {
  return (
  
    <section id="app">
      <Sidebar />
          
      <section id="center">
        <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/operations" element={<Operations />} />
          </Routes>
        
      </section>
    </section>
  )
}

export default App