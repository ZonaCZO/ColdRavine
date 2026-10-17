import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/User';
import './styles/Login.css';

function ChangePassword({user,onChange}:{user:User;onChange:(user:User)=>void}) {
  const [currentPassword,setCurrent]=useState('');
  const [newPassword,setNew]=useState('');
  const [confirm,setConfirm]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const navigate=useNavigate();
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();if(loading)return;
    if(newPassword!==confirm){setError('Passwords do not match');return;}
    setLoading(true);setError('');
    try {
      const response=await fetch('/api/auth/change-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({currentPassword,newPassword})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.message||'Password change failed');
      const me=await fetch('/api/auth/me');
      if(!me.ok)throw new Error('Please sign in again');
      const updated:User=await me.json();onChange(updated);
      navigate(updated.role==='soldier'?`/personnel/${updated.soldierId}`:'/dashboard',{replace:true});
    }catch(error){setError(error instanceof Error?error.message:'Password change failed');}
    finally{setLoading(false);}
  }
  return <section className="login-page"><div className="login-panel"><h1>Change password</h1>
    <p className="login-description">{user.mustChangePassword?'Replace your temporary password to access your account.':'Choose a new password for your account.'}</p>
    <form className="login-form" onSubmit={submit} aria-busy={loading}>
      <label>Current password<input required type="password" autoComplete="current-password" value={currentPassword} onChange={e=>setCurrent(e.target.value)} disabled={loading}/></label>
      <label>New password<input required type="password" autoComplete="new-password" minLength={8} maxLength={256} value={newPassword} onChange={e=>setNew(e.target.value)} disabled={loading}/></label>
      <label>Repeat password<input required type="password" autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} disabled={loading}/></label>
      {error&&<p className="login-alert" role="alert">{error}</p>}
      <button disabled={loading}>{loading?'Saving...':'Save password'}</button>
    </form></div></section>;
}
export default ChangePassword;
