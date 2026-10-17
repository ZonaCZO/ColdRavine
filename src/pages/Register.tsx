import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types/User';
import './styles/Login.css';

function Register({ onLogin }: { onLogin: (user: User) => void }) {
  const [armyName,setArmyName]=useState('');
  const [name,setName]=useState('');
  const [username,setUsername]=useState('');
  const [age,setAge]=useState('');
  const [password,setPassword]=useState('');
  const [confirm,setConfirm]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(loading)return;
    if(password!==confirm){setError('Passwords do not match');return;}
    setLoading(true);setError('');
    try {
      const response=await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({armyName,name,username,password,age:Number(age)})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.message||'Registration failed');
      const me=await fetch('/api/auth/me');
      if(!me.ok)throw new Error('Army created. Sign in to continue');
      onLogin(await me.json());
    }catch(error){setError(error instanceof Error?error.message:'Registration failed');}
    finally{setLoading(false);}
  }
  return <section className="login-page"><div className="login-panel">
    <span className="login-caption">COLDRAVINE</span><h1>Create an army</h1>
    <p className="login-description">Registration for a new army administrator. Soldiers receive accounts from their army.</p>
    <form className="login-form" onSubmit={submit} aria-busy={loading}>
      <label>Army name<input required maxLength={120} value={armyName} onChange={e=>setArmyName(e.target.value)} disabled={loading}/></label>
      <label>Your name<input required maxLength={120} value={name} onChange={e=>setName(e.target.value)} disabled={loading}/></label>
      <label>Age<input required type="number" min={0} max={150} value={age} onChange={e=>setAge(e.target.value)} disabled={loading}/></label>
      <label>Username<input required autoComplete="username" maxLength={60} value={username} onChange={e=>setUsername(e.target.value)} disabled={loading}/></label>
      <label>Password<input required type="password" autoComplete="new-password" minLength={8} maxLength={256} value={password} onChange={e=>setPassword(e.target.value)} disabled={loading}/></label>
      <label>Repeat password<input required type="password" autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} disabled={loading}/></label>
      {error&&<p role="alert" className="login-alert">{error}</p>}
      <button disabled={loading}>{loading?'Creating...':'Create army'}</button>
    </form><Link className="auth-link" to="/login">Back to sign in</Link>
  </div></section>;
}
export default Register;
