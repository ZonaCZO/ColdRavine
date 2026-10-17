import { useEffect,useState } from 'react';
import type { FormEvent } from 'react';
import type { User } from '../types/User';
import type { Unit } from '../types/Unit';
import type { Soldier } from '../types/Soldier';
import CreateSoldier from '../components/army/CreateSoldier';
import CreateUnit from '../components/army/CreateUnit';
import AccessEditor from '../components/army/AccessEditor';
import type { ManagedUser } from '../components/army/AccessEditor';
import EditSoldier from '../components/army/EditSoldier';
import './styles/Army.css';

function ArmyManagement({user}:{user:User}){
  const [units,setUnits]=useState<Unit[]>([]);const [soldiers,setSoldiers]=useState<Soldier[]>([]);
  const [accounts,setAccounts]=useState<ManagedUser[]>([]);const [permissions,setPermissions]=useState<string[]>([]);
  const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [notice,setNotice]=useState('');const [revision,setRevision]=useState(0);
  const [selectedSoldier,setSelectedSoldier]=useState('');const [selectedUnit,setSelectedUnit]=useState('');
  const [commanderUnit,setCommanderUnit]=useState('');const [commanderSoldier,setCommanderSoldier]=useState('');
  const [editId,setEditId]=useState('');const [saving,setSaving]=useState(false);
  const can=(permission:string)=>user.role==='owner'||user.permissions.includes(permission);
  function refresh(){setRevision(value=>value+1);}
  useEffect(()=>{
    let active=true;
    async function load(){
      try{
        const u=await fetch('/api/units');if(!u.ok)throw new Error('Unable to load units');const unitData:Unit[]=await u.json();
        const s=await fetch('/api/soldiers');if(!s.ok)throw new Error('Unable to load personnel');const soldierData:Soldier[]=await s.json();
        let accountData:{users:ManagedUser[];permissions:string[]}={users:[],permissions:[]};
        if(user.role==='owner'){const a=await fetch('/api/admin/users');if(!a.ok)throw new Error('Unable to load accounts');accountData=await a.json();}
        if(active){setUnits(unitData);setSoldiers(soldierData);setAccounts(accountData.users);setPermissions(accountData.permissions);setError('');}
      }catch(error){if(active)setError(error instanceof Error?error.message:'Load failed');}finally{if(active)setLoading(false);}
    }
    load();return()=>{active=false;};
  },[revision,user.role]);
  async function update(event:FormEvent<HTMLFormElement>,url:string,body:object){
    event.preventDefault();if(saving)return;setSaving(true);setError('');setNotice('');
    try{const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await response.json();if(!response.ok)throw new Error(data.message||'Update failed');setNotice('Saved');refresh();}
    catch(error){setError(error instanceof Error?error.message:'Update failed');}finally{setSaving(false);}
  }
  const editing=soldiers.find(soldier=>soldier.id===Number(editId));
  return <section className="army-page"><h1>Army management</h1><p>{user.armyName} · {user.role}</p>
    {error&&<p className="army-error" role="alert">{error}</p>}{notice&&<p role="status">{notice}</p>}
    {loading?<p role="status">Loading...</p>:<>
      {can('units.edit')&&<CreateUnit onCreated={refresh}/>}
      {can('soldiers.create')&&<CreateSoldier units={units} onCreated={refresh}/>}
      {can('soldiers.edit')&&<section className="army-panel"><h2>Edit soldier profile</h2><label>Soldier<select value={editId} onChange={e=>setEditId(e.target.value)}><option value="">Select soldier</option>{soldiers.map(soldier=><option key={soldier.id} value={soldier.id}>{soldier.name}</option>)}</select></label>{editing&&<EditSoldier key={`${editing.id}-${revision}`} soldier={editing} onSaved={()=>{setNotice('Profile saved');refresh();}}/>}</section>}
      {can('soldiers.assign')&&<section className="army-panel"><h2>Transfer soldier</h2><form className="army-form" onSubmit={e=>update(e,`/api/soldiers/${selectedSoldier}/assignment`,{unitId:selectedUnit?Number(selectedUnit):null})}>
        <label>Soldier<select required value={selectedSoldier} onChange={e=>setSelectedSoldier(e.target.value)} disabled={saving}><option value="">Select soldier</option>{soldiers.map(soldier=><option key={soldier.id} value={soldier.id}>{soldier.name} · {soldier.unit}</option>)}</select></label>
        <label>New unit<select value={selectedUnit} onChange={e=>setSelectedUnit(e.target.value)} disabled={saving}><option value="">Unassigned</option>{units.map(unit=><option key={unit.id} value={unit.id}>{unit.name}</option>)}</select></label><button disabled={saving}>Save assignment</button>
      </form></section>}
      {can('units.assign_commander')&&<section className="army-panel"><h2>Assign commander</h2><form className="army-form" onSubmit={e=>update(e,`/api/units/${commanderUnit}/commander`,{soldierId:commanderSoldier?Number(commanderSoldier):null})}>
        <label>Unit<select required value={commanderUnit} onChange={e=>{setCommanderUnit(e.target.value);setCommanderSoldier('');}} disabled={saving}><option value="">Select unit</option>{units.map(unit=><option key={unit.id} value={unit.id}>{unit.name}</option>)}</select></label>
        <label>Commander<select value={commanderSoldier} onChange={e=>setCommanderSoldier(e.target.value)} disabled={saving}><option value="">No commander</option>{soldiers.filter(soldier=>soldier.unitId===Number(commanderUnit)).map(soldier=><option key={soldier.id} value={soldier.id}>{soldier.name}</option>)}</select></label><button disabled={saving}>Save commander</button>
      </form></section>}
      {user.role==='owner'&&<section className="army-panel"><h2>Accounts and officer permissions</h2><p>Ranks do not grant access. Only the owner can change roles and permissions.</p>{accounts.map(account=><AccessEditor key={`${account.id}-${revision}`} account={account} permissions={permissions} onSaved={()=>{setNotice('Access saved');refresh();}}/>)}</section>}
      {user.role==='officer'&&!user.permissions.length&&<p>No management permissions assigned. Contact your army owner.</p>}
    </>}
  </section>;
}
export default ArmyManagement;
