import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Unit } from '../../types/Unit';

type Credentials={username:string;temporaryPassword:string};
function CreateSoldier({units,onCreated}:{units:Unit[];onCreated:()=>void}) {
  const [name,setName]=useState('');const [rank,setRank]=useState('Private');
  const [specialization,setSpecialization]=useState('Infantry');const [status,setStatus]=useState('Active');
  const [age,setAge]=useState('');const [unitId,setUnit]=useState('');const [username,setUsername]=useState('');
  const [loading,setLoading]=useState(false);const [error,setError]=useState('');const [credentials,setCredentials]=useState<Credentials|null>(null);
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();if(loading)return;setLoading(true);setError('');setCredentials(null);
    try{
      const response=await fetch('/api/soldiers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,rank,specialization,status,age:Number(age),unitId:unitId?Number(unitId):null,username})});
      const data=await response.json();if(!response.ok)throw new Error(data.message||'Creation failed');
      setCredentials(data);setName('');setUsername('');setAge('');onCreated();
    }catch(error){setError(error instanceof Error?error.message:'Creation failed');}finally{setLoading(false);}
  }
  return <section className="army-panel"><h2>Create soldier and account</h2>
    <form className="army-form" onSubmit={submit} aria-busy={loading}>
      <label>Name<input required maxLength={120} value={name} onChange={e=>setName(e.target.value)} disabled={loading}/></label>
      <label>Rank<input required maxLength={120} value={rank} onChange={e=>setRank(e.target.value)} disabled={loading}/></label>
      <label>Specialization<input required maxLength={120} value={specialization} onChange={e=>setSpecialization(e.target.value)} disabled={loading}/></label>
      <label>Age<input required type="number" min={0} max={150} value={age} onChange={e=>setAge(e.target.value)} disabled={loading}/></label>
      <label>Status<select value={status} onChange={e=>setStatus(e.target.value)} disabled={loading}>{['Active','Wounded','Reserve'].map(item=><option key={item}>{item}</option>)}</select></label>
      <label>Unit<select value={unitId} onChange={e=>setUnit(e.target.value)} disabled={loading}><option value="">Unassigned</option>{units.map(unit=><option key={unit.id} value={unit.id}>{unit.name}</option>)}</select></label>
      <label>Account username<input required maxLength={60} autoComplete="off" value={username} onChange={e=>setUsername(e.target.value)} disabled={loading}/></label>
      <button disabled={loading}>{loading?'Creating...':'Create soldier'}</button>
    </form>
    {error&&<p role="alert" className="army-error">{error}</p>}
    {credentials&&<div className="army-result" role="status"><p>Account created. Save and give these credentials to the soldier; the password is shown once.</p><p>Username: <strong>{credentials.username}</strong></p><p>Temporary password: <code>{credentials.temporaryPassword}</code></p><button type="button" onClick={()=>setCredentials(null)}>Dismiss</button></div>}
  </section>;
}
export default CreateSoldier;
