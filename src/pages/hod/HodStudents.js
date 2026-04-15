// HodStudents.js
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './HodPages.css';

export function HodStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (branch) params.set('branch', branch);
    if (semester) params.set('semester', semester);
    api.get(`/hod/students?${params}`).then(r => setStudents(r.data)).finally(() => setLoading(false));
  }, [branch, semester]);

  const filtered = students.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || s.pinNumber?.includes(search));
  const pct = s => s.summary?.attendancePercentage ?? '—';
  const pctColor = p => isNaN(p) ? '#546e7a' : p >= 75 ? '#2e7d32' : p >= 60 ? '#f57f17' : '#c62828';

  return (
    <div className="page fade-in">
      <h1 style={{marginBottom:24}}>All Students </h1>
      <div className="filters-bar">
        <input className="search-input" placeholder="Search name or PIN..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={branch} onChange={e => setBranch(e.target.value)}>
          <option value="">All Branches</option>
          {['CS','ME','CE','EE','EC','IT','CH'].map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select className="filter-select" value={semester} onChange={e => setSemester(e.target.value)}>
          <option value="">All Semesters</option>
          {['1SEM','2SEM','3SEM','4SEM','5SEM','6SEM'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {loading ? <div style={{display:'flex',justifyContent:'center',padding:60}}><div className="spinner"/></div> : (
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {filtered.map(s => {
            const p = pct(s);
            return (
              <div key={s.id} className="student-row">
                <div className="s-avatar" style={{background: `linear-gradient(135deg, ${pctColor(p)}, #555)`}}>{s.name?.charAt(0)}</div>
                <div className="s-info">
                  <div className="s-name">{s.name}</div>
                  <div className="s-meta">{s.pinNumber} • {s.branch} {s.semester}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:20,fontWeight:800,color:pctColor(p),fontFamily:'var(--font)'}}>{typeof p === 'number' ? `${p.toFixed(1)}%` : p}</div>
                  <div style={{fontSize:11,color:'var(--gov-muted)'}}>This Month</div>
                </div>
                <div style={{fontSize:13,color:'var(--gov-muted)',textAlign:'right'}}>
                  <div>{s.summary?.daysPresent ?? '—'} days present</div>
                  <div>{s.summary?.totalWorkingDays ?? '—'} working</div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div style={{textAlign:'center',padding:48,color:'var(--gov-muted)'}}>No students found</div>}
        </div>
      )}
    </div>
  );
}

export default HodStudents;
