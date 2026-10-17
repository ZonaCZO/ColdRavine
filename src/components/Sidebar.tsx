import './Sidebar.css';
import { NavLink,useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { User } from '../types/User';

function Sidebar({user,onLogout}:{user:User;onLogout:()=>void}){
  const navigate=useNavigate();
  const [loading,setLoading]=useState(false);const [error,setError]=useState('');
  const items=user.mustChangePassword?[]:user.role==='soldier'?
    [{name:'My profile',path:`/personnel/${user.soldierId}`}]:[
      {name:'Dashboard',path:'/dashboard'},{name:'Personnel',path:'/personnel'},
      {name:'Units',path:'/units'},{name:'Operations',path:'/operations'},
      {name:'Intelligence',path:'/intelligence'},{name:'Tactical Map',path:'/map'},
      {name:'Army management',path:'/army'},
    ];
  async function logout(){if(loading)return;setLoading(true);setError('');
    try{const response=await fetch('/api/auth/logout',{method:'POST'});if(!response.ok&&response.status!==401)throw new Error('Logout failed');onLogout();navigate('/login',{replace:true});}
    catch{setError('Unable to sign out. Try again.');}finally{setLoading(false);}
  }
  return <aside id="sidebar">
    <section id="sidebar-logo"><h2>ColdRavine</h2><p>{user.armyName}</p><p>{user.username} · {user.role}</p></section>
    <nav id="sidebar-sections" aria-label="Main navigation">{items.map(item=><NavLink key={item.path} to={item.path} className={({isActive})=>isActive?'sidebar-section active':'sidebar-section'}>{item.name}</NavLink>)}
      <NavLink to="/change-password" className={({isActive})=>isActive?'sidebar-section active':'sidebar-section'}>Change password</NavLink>
    </nav>
    <button className="sidebar-logout" type="button" onClick={logout} disabled={loading}>{loading?'Signing out...':'Sign out'}</button>
    {error&&<p role="alert">{error}</p>}
  </aside>;
}
export default Sidebar;
