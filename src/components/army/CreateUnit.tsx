import { useState } from 'react';
import type { FormEvent } from 'react';

function CreateUnit({onCreated}:{onCreated:()=>void}) {
  const [name,setName]=useState('');const [specialization,setSpecialization]=useState('');const [status,setStatus]=useState('Active');
  const [loading,setLoading]=useState(false);const [error,setError]=useState('');
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(loading)return;setLoading(true);setError('');
    try{const response=await fetch('/api/units',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,specialization,status})});const data=await response.json();if(!response.ok)throw new Error(data.message||'Creation failed');setName('');setSpecialization('');onCreated();}
    catch(error){setError(error instanceof Error?error.message:'Creation failed');}finally{setLoading(false);}
  }
  return <section className="army-panel"><h2>Create unit</h2><form className="army-form" onSubmit={submit}>
    <label>Name<input required maxLength={120} value={name} onChange={e=>setName(e.target.value)} disabled={loading}/></label>
    <label>Specialization<input required maxLength={120} value={specialization} onChange={e=>setSpecialization(e.target.value)} disabled={loading}/></label>
    <label>Status<select value={status} onChange={e=>setStatus(e.target.value)} disabled={loading}><option>Active</option><option>Reserve</option></select></label>
    <button disabled={loading}>{loading?'Creating...':'Create unit'}</button>
  </form>{error&&<p className="army-error" role="alert">{error}</p>}</section>;
}
export default CreateUnit;
