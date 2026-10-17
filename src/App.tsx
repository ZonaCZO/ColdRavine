import { useEffect,useState } from 'react';
import type { ReactNode } from 'react';
import { Link,Navigate,Route,Routes,useLocation } from 'react-router-dom';
import type { User } from './types/User';
import Sidebar from './components/Sidebar';
import { Dashboard,NotFound,Operations,Personnel,Units,Soldier,UnitDetails,Intelligence,ReportDetails,TacticalMap,Login,OperationDetails } from './pages/index';
import Register from './pages/Register';
import ChangePassword from './pages/ChangePassword';
import ArmyManagement from './pages/ArmyManagement';
import './App.css';

function App(){
  const {pathname}=useLocation();
  const [user,setUser]=useState<User|null>(null);
  const [checking,setChecking]=useState(true);
  const [error,setError]=useState('');
  useEffect(()=>{
    let active=true;
    async function check(){
      try{const response=await fetch('/api/auth/me');if(response.status===401)return;if(!response.ok)throw new Error('Session check failed');const data:User=await response.json();if(active)setUser(data);}
      catch{if(active)setError('Unable to check your session. Try refreshing the page.');}
      finally{if(active)setChecking(false);}
    }
    check();return()=>{active=false;};
  },[]);
  if(checking)return <p role="status">Checking session...</p>;
  if(error)return <p role="alert">{error}</p>;
  const home=user?.mustChangePassword?'/change-password':user?.role==='soldier'?`/personnel/${user.soldierId}`:'/dashboard';
  const authPage=['/login','/register'].includes(pathname);
  function protect(page:ReactNode,staff=false){
    if(!user)return <Navigate to="/login" replace/>;
    if(user.mustChangePassword)return <Navigate to="/change-password" replace/>;
    if(staff&&user.role==='soldier')return <Navigate to={home} replace/>;
    return page;
  }
  return <section id="app">
    {user&&!authPage&&<Sidebar user={user} onLogout={()=>setUser(null)}/>}
    <section id="center" className={authPage?'center-login':''}>
      {user&&!authPage&&<header className="app-profile-bar"><Link to={user.mustChangePassword?'/change-password':'/profile'}>My profile · {user.username}</Link></header>}
      <Routes>
        <Route path="/" element={<Navigate to={user?home:'/login'} replace/>}/>
        <Route path="/login" element={user?<Navigate to={home} replace/>:<Login onLogin={setUser}/>}/>
        <Route path="/register" element={user?<Navigate to={home} replace/>:<Register onLogin={setUser}/>}/>
        <Route path="/change-password" element={user?<ChangePassword user={user} onChange={setUser}/>:<Navigate to="/login" replace/>}/>
        <Route path="/dashboard" element={protect(<Dashboard/>,true)}/>
        <Route path="/army" element={protect(user?<ArmyManagement user={user}/>:null,true)}/>
        <Route path="/personnel" element={protect(user?.role==='soldier'?<Navigate to={home} replace/>:<Personnel/>)}/>
        <Route path="/profile" element={protect(<Soldier user={user??undefined} ownProfile/>)}/>
        <Route path="/personnel/:id" element={protect(<Soldier user={user??undefined}/>)}/>
        <Route path="/units" element={protect(<Units/>,true)}/>
        <Route path="/units/:id" element={protect(<UnitDetails/>,true)}/>
        <Route path="/operations" element={protect(<Operations/>,true)}/>
        <Route path="/operations/:id" element={protect(<OperationDetails/>,true)}/>
        <Route path="/intelligence" element={protect(<Intelligence/>,true)}/>
        <Route path="/intelligence/:id" element={protect(<ReportDetails/>,true)}/>
        <Route path="/map" element={protect(<TacticalMap/>,true)}/>
        <Route path="/tactical-map" element={protect(<TacticalMap/>,true)}/>
        <Route path="*" element={protect(<NotFound/>)}/>
      </Routes>
    </section>
  </section>;
}
export default App;
