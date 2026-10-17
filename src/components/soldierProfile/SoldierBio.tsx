import { useState } from 'react';
import type { FormEvent } from 'react';

export default function SoldierBio({bio,editable}:{bio:string;editable:boolean}) {
  const [value,setValue]=useState(bio);
  const [saved,setSaved]=useState(bio);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');
  async function save(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();if(saving)return;
    setSaving(true);setError('');setMessage('');
    try {
      const response=await fetch('/api/profile/bio',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({bio:value})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.message||'Unable to save bio');
      setValue(data.bio);setSaved(data.bio);setMessage('Bio saved');
    } catch(error) {setError(error instanceof Error?error.message:'Unable to save bio');}
    finally {setSaving(false);}
  }
  return <section className="soldier-bio"><h2>About me</h2>
    {editable?<form onSubmit={save}><label htmlFor="soldier-bio">Bio</label>
      <textarea id="soldier-bio" maxLength={500} rows={5} value={value} disabled={saving} onChange={event=>{setValue(event.target.value);setMessage('');}} aria-describedby="bio-count"/>
      <div className="bio-actions"><small id="bio-count">{value.length} / 500</small><button disabled={saving||value===saved}>{saving?'Saving…':'Save bio'}</button></div>
      {message&&<p role="status">{message}</p>}{error&&<p role="alert">{error}</p>}
    </form>:<p className="bio-text">{bio||'No bio yet.'}</p>}
  </section>;
}
