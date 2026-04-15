import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './HodPages.css';

export default function HodDashboard() {
  const { user } = useAuth();
  const [today, setToday]   = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/hod/today').then(r => setToday(r.data)),
      api.get('/hod/approvals').then(r => setPending(r.data))
    ]).finally(() => setLoading(false));
  }, []);

  const approve = async (userId) => {
    try {
      await api.put(`/hod/users/${userId}/approval`, { isApproved: true });
      setPending(p => p.filter(u => (u.id||u._id) !== userId));
    } catch {}
  };

  if (!user.isApproved) return (
    <div className="page">
      <div className="card" style={{ maxWidth:480, margin:'52px auto', padding:'40px 32px', textAlign:'center' }}>
        <h2 style={{ color:'#1a237e', marginBottom:8 }}>Awaiting Admin Approval</h2>
        <p style={{ color:'#555', fontSize:13 }}>Your HOD account is pending approval from the system administrator.</p>
      </div>
    </div>
  );

  return (
    <div className="page fade-in">
      <div className="page-strip">
        <span>HOD Dashboard — {user.college?.collegeName || user.college?.name || '—'}</span>
        <Link to="/hod/approvals" className="btn btn-orange" style={{ padding:'5px 14px', fontSize:12, position:'relative' }}>
          Approvals
          {pending.length > 0 && <span className="badge-count">{pending.length}</span>}
        </Link>
      </div>
      <div className="breadcrumb-bar">
        Home &rsaquo; HOD &rsaquo; Dashboard &nbsp;|&nbsp; Department: <strong>{user.department}</strong>
      </div>

      {loading
        ? <div style={{ display:'flex', justifyContent:'center', padding:52 }}><div className="spinner"/></div>
        : <>
            {today && (
              <div className="grid-4" style={{ marginBottom:14 }}>
                {[
                  { val:today.summary?.total||0,   label:'Total Students',    color:'#1a237e' },
                  { val:today.summary?.present||0, label:'Present Today',     color:'#1b5e20' },
                  { val:today.summary?.absent||0,  label:'Absent Today',      color:'#b71c1c' },
                  { val:pending.length,             label:'Pending Approvals', color:'#e65100' },
                ].map((s,i) => (
                  <div key={i} className="hstat-card card" style={{ borderTop:`3px solid ${s.color}` }}>
                    <div className="hstat-val" style={{ color:s.color }}>{s.val}</div>
                    <div className="hstat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid-2" style={{ marginBottom:14 }}>
              <div className="card">
                <div className="section-bar">Quick Navigation</div>
                <div style={{ padding:'12px 14px', display:'flex', flexDirection:'column', gap:8 }}>
                  {[
                    ['/hod/today',    "Today's Attendance", 'View who is present and absent'],
                    ['/hod/students', 'All Students',        'Browse students with attendance stats'],
                    ['/hod/approvals',`Approvals (${pending.length})`, 'Approve or reject registrations'],
                    ['/hod/report',   'Monthly Reports',     'Generate and export attendance reports'],
                  ].map(([to,title,sub]) => (
                    <Link key={to} to={to} className="quick-link">
                      <div style={{ flex:1 }}>
                        <div className="quick-link-title">{title}</div>
                        <div className="quick-link-desc">{sub}</div>
                      </div>
                      <span className="quick-link-arrow">&#8250;</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="section-bar">
                  Pending Approvals
                  {pending.length > 0 && <Link to="/hod/approvals">View All</Link>}
                </div>
                {pending.length === 0
                  ? <div style={{ padding:'28px', textAlign:'center', color:'#666', fontSize:13 }}>No pending approvals</div>
                  : pending.slice(0,5).map(u => (
                      <div key={u.id||u._id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 14px', borderBottom:'1px solid #dde1e7' }}>
                        <div className="s-avatar" style={{ width:30, height:30, fontSize:13 }}>{u.name?.charAt(0)}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:12.5 }}>{u.name}</div>
                          <div style={{ fontSize:11, color:'#666' }}>{u.role?.toUpperCase()} · {u.pinNumber||u.department}</div>
                        </div>
                        <button className="btn btn-success" style={{ padding:'3px 11px', fontSize:11 }} onClick={() => approve(u.id||u._id)}>
                          Approve
                        </button>
                      </div>
                    ))
                }
              </div>
            </div>
          </>
      }
    </div>
  );
}
