import { useEffect,useState } from 'react';
import AccessEditor from './AccessEditor';
import type { ManagedUser } from './AccessEditor';

export default function AccountList() {
  const [open,setOpen]=useState(false);
  const [accounts,setAccounts]=useState<ManagedUser[]>([]);
  const [permissions,setPermissions]=useState<string[]>([]);
  const [search,setSearch]=useState('');const [sort,setSort]=useState('name');
  const [page,setPage]=useState(1);const [total,setTotal]=useState(0);
  const [loading,setLoading]=useState(true);const [error,setError]=useState('');
  const [revision,setRevision]=useState(0);const [notice,setNotice]=useState('');
  useEffect(()=>{
    if(!open)return;
    const controller=new AbortController();
    const timer=setTimeout(async()=>{
      try {
        const query=new URLSearchParams({search,sort,page:String(page)});
        const response=await fetch(`/api/admin/users?${query}`,{signal:controller.signal});
        const data=await response.json();
        if(!response.ok)throw new Error(data.message||'Unable to load accounts');
        if(controller.signal.aborted)return;
        const lastPage=Math.max(1,Math.ceil(data.total/10));
        if(page>lastPage){setPage(lastPage);return;}
        setAccounts(data.users);setPermissions(data.permissions);setTotal(data.total);
      } catch(error) {if(!controller.signal.aborted)setError(error instanceof Error?error.message:'Unable to load accounts');}
      finally {if(!controller.signal.aborted)setLoading(false);}
    },250);
    return()=>{clearTimeout(timer);controller.abort();};
  },[open,search,sort,page,revision]);
  function reload(){setLoading(true);setError('');setRevision(value=>value+1);}
  return <section className="army-panel"><h2>Accounts and officer permissions</h2>
    <p>Ranks do not grant access. Only the owner can change roles and permissions.</p>
    <button type="button" aria-expanded={open} aria-controls="army-accounts" onClick={()=>{if(!open){setLoading(true);setError('');}setOpen(!open);}}>{open?'Hide accounts':'Show accounts'}</button>
    {open&&<div id="army-accounts">
      <div className="army-form"><label>Search name or username<input maxLength={120} value={search} onChange={event=>{setSearch(event.target.value);setPage(1);setLoading(true);setError('');}}/></label>
        <label>Sort by<select value={sort} onChange={event=>{setSort(event.target.value);setPage(1);setLoading(true);setError('');}}><option value="name">Name A–Z</option><option value="username">Username A–Z</option><option value="role">Role</option><option value="newest">Newest first</option></select></label></div>
      {notice&&<p role="status">{notice}</p>}
      {loading?<p role="status">Loading accounts…</p>:error?<div role="alert"><p>{error}</p><button onClick={reload}>Retry</button></div>:<>
        <p>{total} accounts</p>
        {accounts.length?accounts.map(account=><AccessEditor key={`${account.id}-${revision}`} account={account} permissions={permissions} onSaved={()=>{setNotice('Access saved');reload();}}/>):<p>No accounts found.</p>}
        <nav className="account-pagination" aria-label="Account pages"><button disabled={page===1} onClick={()=>{setPage(page-1);setLoading(true);}}>Previous</button><span>Page {page} / {Math.max(1,Math.ceil(total/10))}</span><button disabled={page*10>=total} onClick={()=>{setPage(page+1);setLoading(true);}}>Next</button></nav>
      </>}
    </div>}
  </section>;
}
