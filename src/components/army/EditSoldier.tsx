import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Soldier } from '../../types/Soldier';
function EditSoldier({soldier,onSaved}:{soldier:Soldier;onSaved:()=>void}){
  const [name,setName]=useState(soldier.name);const [rank,setRank]=useState(soldier.rank);const [specialization,setSpecialization]=useState(soldier.specialization);
  const [status,setStatus]=useState(soldier.status);const [age,setAge]=useState(soldier.age);const [loading,setLoading]=useState(false);const [error,setError]=useState('');
  async function save(event:FormEvent<HTMLFormElement>){event.preventDefault();if(loading)return;setLoading(true);setError('');
    try{const response=await fetch(`/api/soldiers/${soldier.id}/profile`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,rank,specialization,status,age})});const data=await response.json();if(!response.ok)throw new Error(data.message||'Update failed');onSaved();}
    catch(error){setError(error instanceof Error?error.message:'Update failed');}finally{setLoading(false);}
  }
  return <form className="army-form" onSubmit={save}>
    <label>Name<input required value={name} onChange={e=>setName(e.target.value)} disabled={loading}/></label>
    <label>Rank<input required value={rank} onChange={e=>setRank(e.target.value)} disabled={loading}/></label>
    <label>Specialization<input required value={specialization} onChange={e=>setSpecialization(e.target.value)} disabled={loading}/></label>
    <label>Age<input required type="number" min={0} max={150} value={age} onChange={e=>setAge(Number(e.target.value))} disabled={loading}/></label>
    <label>Status<select value={status} onChange={e=>setStatus(e.target.value as Soldier['status'])} disabled={loading}>{['Active','Wounded','Reserve'].map(item=><option key={item}>{item}</option>)}</select></label>
    <button disabled={loading}>{loading?'Saving...':'Save profile'}</button>{error&&<p className="army-error" role="alert">{error}</p>}
  </form>;
}
export default EditSoldier;
