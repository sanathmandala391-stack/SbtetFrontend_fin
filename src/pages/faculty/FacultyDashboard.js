// FacultyDashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/faculty/today').then(r => setToday(r.data)).finally(() => setLoading(false));
  }, []);

  const present = today?.filter(s => s.todayStatus === 'P').length || 0;
  const absent = today?.filter(s => !s.todayStatus || s.todayStatus === 'A' || s.todayStatus === '-').length || 0;
  const total = today?.length || 0;

  if (!user.isApproved) return (
    <div className="page"><div className="card" style={{maxWidth:480,margin:'60px auto',padding:48,textAlign:'center'}}>
      <div style={{fontSize:56}}>⏳</div><h2 style={{margin:'16px 0 8px',color:'var(--blue-dark)'}}>Awaiting Approval</h2>
      <p style={{color:'var(--gov-muted)'}}>Your account is pending approval from your HOD.</p>
    </div></div>
  );

  return (
    <div className="page fade-in">
      <h1 style={{marginBottom:4}}>Faculty Dashboard ‍</h1>
      <p style={{color:'var(--gov-muted)',marginBottom:28}}>{user.college?.collegeName || user.college?.name} • {user.department}</p>
      <div className="grid-3" style={{marginBottom:28}}>
        <div className="card" style={{padding:24,borderTop:'3px solid var(--blue-dark)'}}>
          <div style={{fontFamily:'var(--font)',fontSize:36,fontWeight:800,color:'var(--blue-dark)'}}>{total}</div>
          <div style={{fontSize:13,color:'var(--gov-muted)',fontWeight:500,textTransform:'uppercase',letterSpacing:.5}}>Total Students</div>
        </div>
        <div className="card" style={{padding:24,borderTop:'3px solid #2e7d32'}}>
          <div style={{fontFamily:'var(--font)',fontSize:36,fontWeight:800,color:'#2e7d32'}}>{present}</div>
          <div style={{fontSize:13,color:'var(--gov-muted)',fontWeight:500,textTransform:'uppercase',letterSpacing:.5}}>Present Today</div>
        </div>
        <div className="card" style={{padding:24,borderTop:'3px solid #c62828'}}>
          <div style={{fontFamily:'var(--font)',fontSize:36,fontWeight:800,color:'#c62828'}}>{absent}</div>
          <div style={{fontSize:13,color:'var(--gov-muted)',fontWeight:500,textTransform:'uppercase',letterSpacing:.5}}>Absent Today</div>
        </div>
      </div>
      <div className="grid-2">
        <Link to="/faculty/students" className="card" style={{padding:24,display:'flex',gap:16,alignItems:'center',textDecoration:'none',color:'var(--text)',transition:'.2s'}}
          onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform=''}>
          <span style={{fontSize:32}}></span>
          <div><div style={{fontWeight:700,fontSize:16}}>Students & Attendance</div><div style={{fontSize:13,color:'var(--gov-muted)',marginTop:4}}>View student details and attendance records</div></div>
          <span style={{marginLeft:'auto',color:'var(--gov-muted)'}}>→</span>
        </Link>
        <Link to="/faculty/report" className="card" style={{padding:24,display:'flex',gap:16,alignItems:'center',textDecoration:'none',color:'var(--text)',transition:'.2s'}}
          onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform=''}>
          <span style={{fontSize:32}}></span>
          <div><div style={{fontWeight:700,fontSize:16}}>Generate Reports</div><div style={{fontSize:13,color:'var(--gov-muted)',marginTop:4}}>Monthly attendance reports with CSV export</div></div>
          <span style={{marginLeft:'auto',color:'var(--gov-muted)'}}>→</span>
        </Link>
      </div>
    </div>
  );
}
