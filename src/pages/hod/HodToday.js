import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './HodPages.css';

const STATUS_COLORS = { P:'#e8f5e9', A:'#ffebee', E:'#fff3e0', HD:'#e3f2fd', '-':'#eceff1' };
const STATUS_TEXT = { P:'#2e7d32', A:'#c62828', E:'#e65100', HD:'#0d47a1', '-':'#546e7a' };
const STATUS_LABEL = { P:'Present', A:'Absent', E:'Partial (Error)', HD:'Half Day', '-':'No Record' };

export default function HodToday() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('present');
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState('');
  const [overrideModal, setOverrideModal] = useState(null);

  const fetchData = () => {
    setLoading(true);
    const params = branch ? `?branch=${branch}` : '';
    api.get(`/hod/today${params}`).then(r => setData(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [branch]);

  const handleOverride = async (studentId, date, newStatus, reason) => {
    try {
      await api.post('/hod/attendance/override', { studentId, date, newStatus, reason });
      toast.success('Attendance updated!');
      setOverrideModal(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update.');
    }
  };

  const lists = {
    present: data?.present || [],
    absent: data?.absent || [],
    error: data?.error || [],
    halfday: data?.halfDay || []
  };

  return (
    <div className="page fade-in">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24,flexWrap:'wrap',gap:12}}>
        <div>
          <div style={{ background:'#1a237e', color:'#fff', padding:'10px 18px', borderRadius:'4px 4px 0 0', marginBottom:0 }}>
        <span style={{ fontSize:15, fontWeight:700 }}> Today's Attendance</span>
      </div>
      <div style={{ background:'#e8eaf6', padding:'7px 16px', fontSize:12, color:'#546e7a', borderBottom:'1px solid #dee2e6', marginBottom:16 }}>
        Home › HOD › Today's Attendance
      </div>
          <p style={{color:'var(--gov-muted)',marginTop:4}}>{new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
        </div>
        <select className="filter-select" value={branch} onChange={e => setBranch(e.target.value)}>
          <option value="">All Branches</option>
          {['CS','ME','CE','EE','EC','IT','CH'].map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Summary */}
      {data && (
        <div className="grid-4" style={{marginBottom:24}}>
          {[
            { tab:'present', label:'Present', val:data.summary?.present, color:'#2e7d32', bg:'#e8f5e9' },
            { tab:'absent', label:'Absent', val:data.summary?.absent, color:'#c62828', bg:'#ffebee' },
            { tab:'error', label:'Error/Partial', val:data.summary?.error, color:'#e65100', bg:'#fff3e0' },
            { tab:'halfday', label:'Half Day', val:data.summary?.halfDay, color:'#0d47a1', bg:'#e3f2fd' },
          ].map(s => (
            <div key={s.tab} className="card" style={{padding:20,borderTop:`3px solid ${s.color}`,cursor:'pointer',background: activeTab===s.tab?s.bg:'#fff'}}
              onClick={() => setActiveTab(s.tab)}>
              <div style={{fontFamily:'var(--font)',fontSize:32,fontWeight:800,color:s.color}}>{s.val || 0}</div>
              <div style={{fontSize:13,color:'var(--gov-muted)',fontWeight:500}}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tab list */}
      <div className="today-tabs">
        {['present','absent','error','halfday'].map(t => (
          <button key={t} className={`today-tab ${activeTab===t?'active':''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)} ({lists[t].length})
          </button>
        ))}
      </div>

      {loading ? <div style={{display:'flex',justifyContent:'center',padding:60}}><div className="spinner"/></div> : (
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {lists[activeTab].length === 0 ? (
            <div style={{textAlign:'center',padding:48,color:'var(--gov-muted)',fontSize:15}}>No students in this category today</div>
          ) : lists[activeTab].map(s => {
            const status = s.todayRecord?.status || (activeTab==='absent'?'A':'-');
            return (
              <div key={s.id} className="student-row">
                <div className="s-avatar">{s.name?.charAt(0)}</div>
                <div className="s-info">
                  <div className="s-name">{s.name}</div>
                  <div className="s-meta">{s.pinNumber} • {s.branch} {s.semester} {s.todayRecord?.checkIn?.time ? `• In: ${new Date(s.todayRecord.checkIn.time).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}` : ''} {s.todayRecord?.checkOut?.time ? `• Out: ${new Date(s.todayRecord.checkOut.time).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}` : ''}</div>
                </div>
                <div className="s-status" style={{background:STATUS_COLORS[status],color:STATUS_TEXT[status]}}>
                  {STATUS_LABEL[status] || status}
                </div>
                <button className="btn btn-outline" style={{padding:'6px 12px',fontSize:12}}
                  onClick={() => setOverrideModal({ studentId: s.id, name: s.name, currentStatus: status, date: new Date().toISOString().split('T')[0] })}>
                  Override
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Override Modal */}
      {overrideModal && (
        <OverrideModal data={overrideModal} onClose={() => setOverrideModal(null)} onSubmit={handleOverride} />
      )}
    </div>
  );
}

function OverrideModal({ data, onClose, onSubmit }) {
  const [newStatus, setNewStatus] = useState('P');
  const [reason, setReason] = useState('');
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999}}>
      <div className="card" style={{padding:32,maxWidth:400,width:'90%'}}>
        <h3 style={{marginBottom:8,color:'var(--blue-dark)'}}>Override Attendance</h3>
        <p style={{fontSize:14,color:'var(--gov-muted)',marginBottom:20}}>Student: <strong>{data.name}</strong> | Current: <strong>{data.currentStatus}</strong></p>
        <div className="form-group" style={{marginBottom:16}}>
          <label className="form-label">New Status</label>
          <select className="form-input" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
            <option value="P">P — Present</option>
            <option value="A">A — Absent</option>
            <option value="HD">HD — Half Day</option>
            <option value="H">H — Holiday</option>
          </select>
        </div>
        <div className="form-group" style={{marginBottom:20}}>
          <label className="form-label">Reason</label>
          <textarea className="form-input" rows={3} placeholder="Reason for override..." value={reason} onChange={e => setReason(e.target.value)} />
        </div>
        <div style={{display:'flex',gap:12}}>
          <button className="btn btn-outline" style={{flex:1}} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{flex:1}} onClick={() => onSubmit(data.studentId, data.date, newStatus, reason)}>Update</button>
        </div>
      </div>
    </div>
  );
}
