import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import AttendanceCalendar from '../../components/common/AttendanceCalendar';

export default function FacultyStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [selected, setSelected] = useState(null);
  const [attData, setAttData] = useState(null);
  const [loading, setLoading] = useState(true);
  const now = new Date();

  useEffect(() => {
    const p = new URLSearchParams();
    if (branch) p.set('branch', branch);
    if (semester) p.set('semester', semester);
    api.get(`/faculty/students?${p}`).then(r => setStudents(r.data)).finally(() => setLoading(false));
  }, [branch, semester]);

  const viewAttendance = async (student) => {
    setSelected(student);
    try {
      const r = await api.get(`/faculty/students/${student.id}/attendance?month=${now.getMonth()+1}&year=${now.getFullYear()}`);
      // Backend returns AttendanceSummary with monthlyData and stats
      setAttData({
        monthlyData: r.data.monthlyData || [],
        stats: r.data.stats || null
      });
    } catch { setAttData(null); }
  };

  const filtered = students.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()) || s.pinNumber?.includes(search));

  return (
    <div className="page fade-in">
      <h1 style={{marginBottom:24}}>Students </h1>
      {!selected ? (
        <>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:20}}>
            <input style={{padding:'8px 16px',border:'2px solid var(--gov-border)',borderRadius:8,fontSize:14,flex:1,maxWidth:300,outline:'none'}}
              placeholder="Search name or PIN..." value={search} onChange={e => setSearch(e.target.value)} />
            <select style={{padding:'8px 16px',border:'2px solid var(--gov-border)',borderRadius:8,fontSize:14,background:'#fff'}} value={branch} onChange={e => setBranch(e.target.value)}>
              <option value="">All Branches</option>
              {['CS','ME','CE','EE','EC','IT','CH'].map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select style={{padding:'8px 16px',border:'2px solid var(--gov-border)',borderRadius:8,fontSize:14,background:'#fff'}} value={semester} onChange={e => setSemester(e.target.value)}>
              <option value="">All Sems</option>
              {['1SEM','2SEM','3SEM','4SEM','5SEM','6SEM'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {loading ? <div style={{display:'flex',justifyContent:'center',padding:60}}><div className="spinner"/></div> : (
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {filtered.map(s => (
                <div key={s.id} className="card" style={{padding:'14px 20px',display:'flex',alignItems:'center',gap:14,cursor:'pointer',transition:'.2s'}}
                  onClick={() => viewAttendance(s)} onMouseOver={e=>e.currentTarget.style.transform='translateY(-1px)'} onMouseOut={e=>e.currentTarget.style.transform=''}>
                  <div style={{width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,var(--blue-dark),var(--orange))',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,flexShrink:0}}>{s.name?.charAt(0)}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600}}>{s.name}</div>
                    <div style={{fontSize:12,color:'var(--gov-muted)',marginTop:2}}>{s.pinNumber} • {s.branch} {s.semester}</div>
                  </div>
                  <span style={{color:'var(--gov-muted)',fontSize:18}}>→</span>
                </div>
              ))}
              {filtered.length === 0 && <div style={{textAlign:'center',padding:48,color:'var(--gov-muted)'}}>No students found</div>}
            </div>
          )}
        </>
      ) : (
        <>
          <button className="btn btn-outline" style={{marginBottom:24}} onClick={() => { setSelected(null); setAttData(null); }}>← Back to List</button>
          <div className="card" style={{padding:24,marginBottom:24}}>
            <h2 style={{color:'var(--blue-dark)'}}>{selected.name}</h2>
            <p style={{color:'var(--gov-muted)',marginTop:4,fontSize:14}}>{selected.pinNumber} • {selected.branch} {selected.semester}</p>
          </div>
          {attData ? <AttendanceCalendar monthlyData={attData.monthlyData} stats={attData.stats} /> : <div style={{textAlign:'center',padding:48}}><div className="spinner" style={{margin:'0 auto'}}/></div>}
        </>
      )}
    </div>
  );
}
