import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './AdminPages.css';

export default function AdminColleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/college').then(r => setColleges(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = colleges.filter(c => {
    const q = search.toLowerCase();
    return !q || c.collegeName?.toLowerCase().includes(q) || c.collegeCode?.toLowerCase().includes(q) || c.district?.toLowerCase().includes(q);
  });

  return (
    <div className="page fade-in">
      <div style={{ background:'#1a237e', color:'#fff', padding:'10px 18px', borderRadius:'4px 4px 0 0', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <span style={{ fontSize:15, fontWeight:700 }}> Affiliated Colleges — SBTET Telangana</span>
        <Link to="/admin/colleges/register" className="btn btn-accent" style={{ padding:'6px 16px', fontSize:12 }}>+ Register College</Link>
      </div>
      <div style={{ background:'#e8eaf6', padding:'7px 16px', fontSize:12, color:'#546e7a', borderBottom:'1px solid #dee2e6', marginBottom:16 }}>
        Home &rsaquo; Admin &rsaquo; Colleges
      </div>

      {/* Filter bar */}
      <div className="card" style={{ padding:'12px 16px', marginBottom:14, display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
        <input
          style={{ padding:'7px 12px', border:'1px solid #dee2e6', borderRadius:3, fontSize:13, flex:1, maxWidth:320 }}
          placeholder="Search college name, code or district…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <span style={{ fontSize:12, color:'#6c757d', marginLeft:'auto' }}>{filtered.length} college(s) found</span>
      </div>

      {loading
        ? <div style={{ display:'flex', justifyContent:'center', padding:60 }}><div className="spinner"/></div>
        : <div className="card" style={{ overflow:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr>
                  {['#','Code','College Name','District','Principal','Contact','Status'].map((h,i) => (
                    <th key={i} style={{ background:'#1a237e', color:'#fff', padding:'9px 12px', textAlign:'left', fontSize:11, textTransform:'uppercase', letterSpacing:0.4, fontWeight:700, borderRight:'1px solid #283593', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0
                  ? <tr><td colSpan={7} style={{ textAlign:'center', padding:40, color:'#6c757d' }}>No colleges found</td></tr>
                  : filtered.map((c,i) => (
                    <tr key={c.id||c._id} style={{ borderBottom:'1px solid #dee2e6', background: i%2===0 ? '#fff' : '#f8f9fb' }}>
                      <td style={{ padding:'9px 12px', color:'#6c757d' }}>{i+1}</td>
                      <td style={{ padding:'9px 12px', fontWeight:800, color:'#1a237e' }}>{c.collegeCode}</td>
                      <td style={{ padding:'9px 12px', fontWeight:600 }}>{c.collegeName||c.name}</td>
                      <td style={{ padding:'9px 12px', color:'#6c757d' }}>{c.district||'—'}</td>
                      <td style={{ padding:'9px 12px', color:'#6c757d' }}>{c.principalName||'—'}</td>
                      <td style={{ padding:'9px 12px', color:'#6c757d', fontSize:12 }}>{c.phone||'—'}</td>
                      <td style={{ padding:'9px 12px' }}><span style={{ background:'#e8f5e9', color:'#2e7d32', padding:'2px 10px', borderRadius:3, fontSize:11, fontWeight:700 }}>Active</span></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
      }
    </div>
  );
}
