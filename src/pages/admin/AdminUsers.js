import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './AdminPages.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (role) p.set('role', role);
    api.get(`/admin/users?${p}`).then(r => setUsers(r.data)).finally(() => setLoading(false));
  };
  useEffect(fetchUsers, [role]);

  const handleApprove = async (userId, isApproved) => {
    try {
      await api.put(`/admin/users/${userId}/approval`, { isApproved });
      toast.success(isApproved ? 'User approved!' : 'User revoked.');
      setUsers(u => u.map(x => (x.id||x._id) === userId ? { ...x, isApproved } : x));
    } catch { toast.error('Action failed.'); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.pinNumber?.includes(search) ||
    u.college?.collegeCode?.includes(search) || u.collegeCode?.includes(search)
  );

  const roleBadge = { student:'#e3f2fd:#0d47a1', faculty:'#e8f5e9:#2e7d32', hod:'#f3e5f5:#4a148c' };

  return (
    <div className="page fade-in">
      <div style={{ background:'#1a237e', color:'#fff', padding:'10px 18px', borderRadius:'4px 4px 0 0', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
        <span style={{ fontSize:15, fontWeight:700 }}> User Management — All Colleges</span>
        <span style={{ fontSize:12, opacity:0.8 }}>{filtered.length} record(s)</span>
      </div>
      <div style={{ background:'#e8eaf6', padding:'7px 16px', fontSize:12, color:'#546e7a', borderBottom:'1px solid #dee2e6', marginBottom:16 }}>
        Home &rsaquo; Admin &rsaquo; Users
      </div>

      {/* Filters */}
      <div className="card" style={{ padding:'11px 14px', marginBottom:14, display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
        <input
          style={{ padding:'7px 12px', border:'1px solid #dee2e6', borderRadius:3, fontSize:13, flex:1, maxWidth:300 }}
          placeholder="Search name, email, PIN or college…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        {['','student','faculty','hod'].map(r => (
          <button key={r}
            style={{ padding:'6px 16px', borderRadius:3, fontWeight:600, fontSize:12, border:'1px solid', cursor:'pointer', transition:'.15s',
              borderColor: role===r ? '#1a237e' : '#dee2e6',
              background: role===r ? '#1a237e' : '#fff',
              color: role===r ? '#fff' : '#6c757d' }}
            onClick={() => setRole(r)}>
            {r==='' ? 'All Roles' : r.toUpperCase()}
          </button>
        ))}
      </div>

      {loading
        ? <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner"/></div>
        : <div className="card" style={{ overflow:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr>
                  {['#','Name','Role','Email','College','PIN / Dept','Branch','Status','Action'].map((h,i) => (
                    <th key={i} style={{ background:'#1a237e', color:'#fff', padding:'9px 12px', textAlign:'left', fontSize:11, textTransform:'uppercase', letterSpacing:0.4, fontWeight:700, borderRight:'1px solid #283593', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={9} style={{ textAlign:'center', padding:40, color:'#6c757d' }}>No users found</td></tr>
                  : filtered.map((u,i) => {
                    const [bg,clr] = (roleBadge[u.role?.toLowerCase()]||'#f5f5f5:#555').split(':');
                    return (
                      <tr key={u.id||u._id} style={{ borderBottom:'1px solid #dee2e6', background: i%2===0 ? '#fff' : '#f8f9fb' }}>
                        <td style={{ padding:'9px 12px', color:'#6c757d' }}>{i+1}</td>
                        <td style={{ padding:'9px 12px', fontWeight:700 }}>{u.name}</td>
                        <td style={{ padding:'9px 12px' }}><span style={{ background:bg, color:clr, padding:'2px 9px', borderRadius:3, fontSize:11, fontWeight:700 }}>{u.role?.toUpperCase()}</span></td>
                        <td style={{ padding:'9px 12px', fontSize:12 }}>{u.email}</td>
                        <td style={{ padding:'9px 12px', fontSize:12 }}>{u.college?.collegeName||u.college?.name||u.collegeCode||'—'}</td>
                        <td style={{ padding:'9px 12px', fontSize:12 }}>{u.pinNumber||u.department||'—'}</td>
                        <td style={{ padding:'9px 12px', fontSize:12 }}>{u.branch ? `${u.branch} ${u.semester}` : '—'}</td>
                        <td style={{ padding:'9px 12px' }}>
                          <span style={{ background: u.isApproved ? '#e8f5e9' : '#fff8e1', color: u.isApproved ? '#2e7d32' : '#c8a000', padding:'2px 9px', borderRadius:3, fontSize:11, fontWeight:700 }}>
                            {u.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding:'9px 12px' }}>
                          {!u.isApproved
                            ? <button className="btn btn-success" style={{ padding:'4px 12px', fontSize:11 }} onClick={() => handleApprove(u.id||u._id, true)}>Approve</button>
                            : <button className="btn btn-danger"  style={{ padding:'4px 12px', fontSize:11 }} onClick={() => handleApprove(u.id||u._id, false)}>Revoke</button>
                          }
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
      }
    </div>
  );
}
