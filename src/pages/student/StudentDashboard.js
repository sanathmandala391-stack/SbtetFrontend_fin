import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './StudentPages.css';

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [rec, setRec]         = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/attendance/today').then(r => setRec(r.data.record)),
      api.get('/student/attendance').then(r => setSummary(r.data.stats)),
    ]).finally(() => setLoading(false));
  }, []);

  if (!user.isApproved) return (
    <div className="page">
      <div className="pending-card card">
        <svg width="52" height="52" viewBox="0 0 24 24" fill="#f0a500" style={{ marginBottom: 4 }}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <h2>Account Pending Approval</h2>
        <p>Your registration is under review by your HOD. You will be able to mark attendance once approved.</p>
        <div className="pending-info">
          <span><strong>Name:</strong> {user.name}</span>
          <span><strong>PIN:</strong> {user.pinNumber}</span>
          <span><strong>College:</strong> {user.collegeCode}</span>
          <span><strong>Branch:</strong> {user.branch} — {user.semester}</span>
        </div>
      </div>
    </div>
  );

  const pct         = parseFloat(summary?.percentage || 0);
  const pctColor    = pct >= 75 ? '#1a7a3c' : pct >= 65 ? '#c04a00' : '#c0392b';
  const workingDays = summary?.workingDays || 0;
  const presentDays = summary?.presentDays || 0;
  const halfDays    = summary?.halfDays    || 0;
  const absentDays  = summary?.absentDays  || 0;
  const effective   = presentDays + halfDays * 0.5;

  const todayMap = {
    P:  { label: 'Present',                       color: '#1a7a3c', bg: '#e6f4ec', border: '#b2dfc2' },
    A:  { label: 'Absent',                        color: '#c0392b', bg: '#fde8e8', border: '#f5b3b3' },
    E:  { label: 'Checked In — Checkout Pending', color: '#c04a00', bg: '#fff3e6', border: '#f5c89a' },
    HD: { label: 'Half Day',                      color: '#0057b8', bg: '#e3eefb', border: '#aacdef' },
  };
  const tod = rec ? (todayMap[rec.status] || { label: rec.status, color: '#555', bg: '#f0f2f5', border: '#d0d7e2' })
                  : { label: 'Not Marked',         color: '#555',   bg: '#f0f2f5', border: '#d0d7e2' };

  return (
    <div className="page fade-in">
      <div className="page-strip">
        <span>Student Dashboard — {getGreeting()}, {user.name?.split(' ')[0]}</span>
        <Link to="/student/mark" className="btn btn-accent btn-sm">Mark Attendance</Link>
      </div>
      <div className="breadcrumb-bar">
        <a href="/">Home</a> &rsaquo; Student &rsaquo; Dashboard
        &nbsp;|&nbsp; PIN: <strong>{user.pinNumber}</strong>
        &nbsp;|&nbsp; {user.branch} &nbsp;|&nbsp; {user.semester}
        &nbsp;|&nbsp; {user.college?.name || user.collegeCode}
      </div>

      {loading
        ? <div style={{ display:'flex', justifyContent:'center', padding:56 }}><div className="spinner" /></div>
        : <>
            {/* Today status */}
            <div
              className="today-status-card card"
              style={{ borderLeft:`3px solid ${tod.color}`, background: tod.bg, borderColor: tod.border }}
            >
              <div style={{ flex:1 }}>
                <div className="today-label">Today's Attendance Status</div>
                <div className="today-status" style={{ color: tod.color }}>{tod.label}</div>
                {rec?.checkIn?.time && (
                  <div className="today-times">
                    Check-in: {new Date(rec.checkIn.time).toLocaleTimeString()}
                    {rec.checkOut?.time && ` | Check-out: ${new Date(rec.checkOut.time).toLocaleTimeString()}`}
                  </div>
                )}
              </div>
              {(!rec || rec.status === 'E') && (
                <Link to="/student/mark" className="btn btn-primary btn-sm" style={{ flexShrink:0 }}>
                  {!rec ? 'Check In' : 'Check Out'}
                </Link>
              )}
            </div>

            {/* Big attendance % card */}
            <div className="card" style={{ padding:'20px 22px', marginTop:14, borderTop:`3px solid ${pctColor}` }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
                <div>
                  <div style={{ fontSize:11, color:'#666', fontWeight:700, textTransform:'uppercase', letterSpacing:0.5, marginBottom:6 }}>Semester Attendance</div>
                  <div style={{ fontSize:52, fontWeight:900, color:pctColor, lineHeight:1, fontFamily:"'Open Sans', sans-serif" }}>
                    {pct.toFixed(2)}%
                  </div>
                  <div style={{ fontSize:13, color:pctColor, fontWeight:700, marginTop:6 }}>
                    {pct >= 75 ? 'Eligible for Examination' :
                     pct >= 65 ? 'Condonation applicable — pay fee' :
                     'Detained — below 65%'}
                  </div>
                </div>
                {/* Circular progress */}
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="46" fill="none" stroke="#e8edf5" strokeWidth="10"/>
                  <circle cx="55" cy="55" r="46" fill="none" stroke={pctColor} strokeWidth="10"
                    strokeDasharray={`${2*Math.PI*46*Math.min(pct,100)/100} 999`}
                    strokeLinecap="round" transform="rotate(-90 55 55)"/>
                  <text x="55" y="60" textAnchor="middle" fontSize="18" fontWeight="900" fill={pctColor} fontFamily="Open Sans">
                    {pct.toFixed(0)}%
                  </text>
                </svg>
              </div>
              {workingDays > 0 && (
                <div className="gov-notice info" style={{ marginTop:14 }}>
                  Each present day adds <strong>{(100/workingDays).toFixed(2)}%</strong> ({workingDays} working days this semester).
                  {pct < 75 && <> You need <strong>{Math.max(0, Math.ceil((0.75*workingDays - effective)/0.25))}</strong> more present day(s) to reach 75%.</>}
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="grid-4" style={{ marginTop:14 }}>
              {[
                { val: workingDays, label: 'Working Days',   color: '#003580' },
                { val: presentDays, label: 'Days Present',   color: '#1a7a3c' },
                { val: halfDays,    label: 'Half Days (HP)', color: '#c04a00' },
                { val: absentDays,  label: 'Absent Days',    color: '#c0392b' },
              ].map((s,i) => (
                <div key={i} className="stat-card card">
                  <div className="stat-card-val" style={{ color: s.color }}>{s.val}</div>
                  <div className="stat-card-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="quick-actions">
              <Link to="/student/mark" className="quick-action-card">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0057b8">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span className="qa-label">Mark Attendance</span>
                <span className="qa-arrow">&#8250;</span>
              </Link>
              <Link to="/student/attendance" className="quick-action-card">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0057b8">
                  <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                <span className="qa-label">View Attendance Report</span>
                <span className="qa-arrow">&#8250;</span>
              </Link>
            </div>

            {/* Legend */}
            <div className="info-box card">
              <h3>SBTET Attendance Rules</h3>
              <div className="info-grid">
                {[
                  ['P',   'status-P',  'Present — Checked in + out, 6 hr gap'],
                  ['HP',  'status-HD', 'Half Day — Less than 6 hrs present'],
                  ['E',   'status-E',  'Error — Checked in, no checkout'],
                  ['A',   'status-A',  'Absent — No attendance marked'],
                  ['W',   'status-W',  'Weekend — No working day'],
                  ['H',   'status-H',  'Holiday — Government / College holiday'],
                ].map(([code, cls, desc]) => (
                  <div key={code} className="info-item">
                    <span className={`info-badge ${cls}`}>{code}</span>
                    <span>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
      }
    </div>
  );
}
