import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './HodPages.css';

export default function HodApprovals() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/hod/approvals').then(r => setPending(r.data)).finally(() => setLoading(false));
  }, []);

  const handleAction = async (userId, isApproved) => {
    try {
      await api.put(`/hod/users/${userId}/approval`, { isApproved });
      toast.success(isApproved ? 'User approved!' : 'User rejected.');
      setPending(p => p.filter(u => (u.id||u._id) !== userId));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed.'); }
  };

  return (
    <div className="page fade-in">
      <div style={{ background:'#1a237e', color:'#fff', padding:'10px 18px', borderRadius:'4px 4px 0 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:15, fontWeight:700 }}> Pending Registrations — HOD Approval</span>
        <span style={{ background:'#e65100', color:'#fff', padding:'3px 12px', borderRadius:3, fontSize:12, fontWeight:700 }}>{pending.length} Pending</span>
      </div>
      <div style={{ background:'#e8eaf6', padding:'7px 16px', fontSize:12, color:'#546e7a', borderBottom:'1px solid #dee2e6', marginBottom:16 }}>
        Home &rsaquo; HOD &rsaquo; Approvals
      </div>

      {loading
        ? <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner"/></div>
        : pending.length === 0
          ? <div className="card" style={{ padding:56, textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:14 }}></div>
              <h3 style={{ color:'#1a237e', marginBottom:6 }}>All Caught Up!</h3>
              <p style={{ color:'#6c757d', fontSize:13 }}>No pending approvals at this time.</p>
            </div>
          : <div className="card" style={{ overflow:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr>
                    {['#','Photo','Name','Role','Email','PIN / Dept','Branch / Sem','Registered','Actions'].map((h,i) => (
                      <th key={i} style={{ background:'#1a237e', color:'#fff', padding:'9px 12px', textAlign:'left', fontSize:11, textTransform:'uppercase', letterSpacing:0.4, fontWeight:700, borderRight:'1px solid #283593', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pending.map((u,i) => (
                    <tr key={u.id||u._id} style={{ borderBottom:'1px solid #dee2e6', background: i%2===0 ? '#fff' : '#f8f9fb' }}>
                      <td style={{ padding:'9px 12px', color:'#6c757d' }}>{i+1}</td>
                      <td style={{ padding:'9px 12px' }}>
                        {u.faceImageUrl
                          ? <img src={u.faceImageUrl} alt="face" style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover', border:'2px solid #dee2e6' }} />
                          : <div style={{ width:36, height:36, borderRadius:'50%', background:'#1a237e', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:15 }}>{u.name?.charAt(0)}</div>
                        }
                      </td>
                      <td style={{ padding:'9px 12px', fontWeight:700 }}>{u.name}</td>
                      <td style={{ padding:'9px 12px' }}><span style={{ background:'#fff8e1', color:'#c8a000', padding:'2px 9px', borderRadius:3, fontSize:11, fontWeight:700, border:'1px solid #ffe082' }}>{u.role?.toUpperCase()}</span></td>
                      <td style={{ padding:'9px 12px', fontSize:12 }}>{u.email}</td>
                      <td style={{ padding:'9px 12px', fontSize:12 }}>{u.pinNumber||u.department||'—'}</td>
                      <td style={{ padding:'9px 12px', fontSize:12 }}>{u.branch ? `${u.branch} · ${u.semester}` : '—'}</td>
                      <td style={{ padding:'9px 12px', fontSize:11, color:'#6c757d', whiteSpace:'nowrap' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                      </td>
                      <td style={{ padding:'9px 12px' }}>
                        <div style={{ display:'flex', gap:5 }}>
                          <button className="btn btn-success" style={{ padding:'4px 12px', fontSize:11 }} onClick={() => handleAction(u.id||u._id, true)}> Approve</button>
                          <button className="btn btn-danger"  style={{ padding:'4px 12px', fontSize:11 }} onClick={() => handleAction(u.id||u._id, false)}> Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      }
    </div>
  );
}
