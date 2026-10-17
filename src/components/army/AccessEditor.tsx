import { useState } from 'react';
export type ManagedUser={id:number;username:string;name:string;role:'owner'|'officer'|'soldier';permissions:string[]};
function AccessEditor({account,permissions,onSaved}:{account:ManagedUser;permissions:string[];onSaved:()=>void}){
  const [role,setRole]=useState(account.role);const [selected,setSelected]=useState(account.permissions);
  const [loading,setLoading]=useState(false);const [error,setError]=useState('');
  async function save(){
    if(loading)return;setLoading(true);setError('');
    try{const response=await fetch(`/api/admin/users/${account.id}/access`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({role,permissions:role==='officer'?selected:[]})});const data=await response.json();if(!response.ok)throw new Error(data.message||'Update failed');onSaved();}
    catch(error){setError(error instanceof Error?error.message:'Update failed');}finally{setLoading(false);}
  }
  return <article className="army-account"><h3>{account.name} · {account.username}</h3>
    {account.role==='owner'?<p>Army owner · Full access</p>:<>
      <label>Role<select value={role} disabled={loading} onChange={e=>setRole(e.target.value as ManagedUser['role'])}><option value="soldier">Soldier — own profile</option><option value="officer">Officer — army access and assigned permissions</option></select></label>
      {role==='officer'&&<fieldset disabled={loading}><legend>Officer permissions</legend>{permissions.map(permission=><label className="army-checkbox" key={permission}>
        <input type="checkbox" checked={selected.includes(permission)} onChange={e=>setSelected(e.target.checked?[...selected,permission]:selected.filter(item=>item!==permission))}/>
        {permission}{['operations.manage','intelligence.manage'].includes(permission)?' (reserved for future write APIs)':''}
      </label>)}</fieldset>}
      <button type="button" disabled={loading} onClick={save}>{loading?'Saving...':'Save access'}</button>
    </>}{error&&<p role="alert" className="army-error">{error}</p>}
  </article>;
}
export default AccessEditor;
