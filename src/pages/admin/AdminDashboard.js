import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './AdminPages.css';

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page fade-in">
      <div className="page-strip">
        <span>Admin Dashboard — SBTET Telangana System Overview</span>
        <Link to="/admin/colleges/register" className="btn btn-orange" style={{ padding:'5px 14px', fontSize:12 }}>
          + Register College
        </Link>
      </div>
      <div className="breadcrumb-bar">Home &rsaquo; Admin &rsaquo; Dashboard</div>

      {loading
        ? <div style={{ display:'flex', justifyContent:'center', padding:52 }}><div className="spinner"/></div>
        : stats && <>
            <div className="grid-4" style={{ marginBottom:14 }}>
              {[
                { val:stats.totalColleges,    label:'Registered Colleges', color:'#1a237e' },
                { val:stats.totalStudents,    label:'Total Students',       color:'#1b5e20' },
                { val:stats.totalFaculty,     label:'Faculty Members',      color:'#4a148c' },
                { val:stats.pendingApprovals, label:'Pending Approvals',    color:'#e65100' },
              ].map((s,i) => (
                <div key={i} className="stat-card" style={{ borderTop:`3px solid ${s.color}` }}>
                  <div className="stat-card-val" style={{ color:s.color }}>{s.val}</div>
                  <div className="stat-card-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid-2" style={{ marginBottom:14 }}>
              <div className="card">
                <div className="section-bar">Today's Attendance Snapshot</div>
                <div style={{ padding:'18px 20px', display:'flex', gap:32 }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:38, fontWeight:900, color:'#1b5e20' }}>{stats.todayPresent}</div>
                    <div style={{ fontSize:11, color:'#666', textTransform:'uppercase', marginTop:3 }}>Present</div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:38, fontWeight:900, color:'#b71c1c' }}>{stats.todayAbsent}</div>
                    <div style={{ fontSize:11, color:'#666', textTransform:'uppercase', marginTop:3 }}>Absent</div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="section-bar">Quick Actions</div>
                <div style={{ padding:'14px', display:'flex', flexDirection:'column', gap:8 }}>
                  <Link to="/admin/colleges/register" className="quick-link">
                    <div className="quick-link-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="#1a237e"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg></div>
                    <div><div className="quick-link-title">Register New College</div><div className="quick-link-desc">Add a new polytechnic college</div></div>
                    <span className="quick-link-arrow">&#8250;</span>
                  </Link>
                  <Link to="/admin/approvals" className="quick-link" style={{ position:'relative' }}>
                    <div className="quick-link-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="#1a237e"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div>
                    <div><div className="quick-link-title">Review Approvals</div><div className="quick-link-desc">{stats.pendingApprovals} pending</div></div>
                    {stats.pendingApprovals > 0 && <span style={{ background:'#c62828', color:'#fff', borderRadius:10, padding:'1px 7px', fontSize:11, fontWeight:700, marginLeft:'auto' }}>{stats.pendingApprovals}</span>}
                    <span className="quick-link-arrow">&#8250;</span>
                  </Link>
                  <Link to="/admin/users" className="quick-link">
                    <div className="quick-link-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="#1a237e"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg></div>
                    <div><div className="quick-link-title">Manage Users</div><div className="quick-link-desc">All students, faculty, HODs</div></div>
                    <span className="quick-link-arrow">&#8250;</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="section-bar">
                Recently Registered Colleges
                <Link to="/admin/colleges">View All</Link>
              </div>
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>#</th><th>Code</th><th>College Name</th><th>District</th><th>Added On</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.recentColleges||[]).map((c,i) => (
                    <tr key={c.id}>
                      <td style={{ color:'#888' }}>{i+1}</td>
                      <td><strong style={{ color:'#1a237e' }}>{c.collegeCode}</strong></td>
                      <td style={{ fontWeight:600 }}>{c.collegeName||c.name}</td>
                      <td style={{ color:'#666' }}>{c.district||'—'}</td>
                      <td style={{ color:'#888', fontSize:12 }}>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                      <td><span className="badge badge-approved">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
      }
    </div>
  );
}
