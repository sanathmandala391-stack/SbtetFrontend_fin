import React, { useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './HodPages.css';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function HodReport() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [branch, setBranch] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ month, year });
      if (branch) params.set('branch', branch);
      const r = await api.get(`/hod/report?${params}`);
      setReport(r.data);
    } catch (err) {
      toast.error('Failed to fetch report.');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!report?.length) return;
    const headers = ['Name','PIN','Branch','Semester','Working Days','Present','Half Day','Absent','Percentage'];
    const rows = report.map(r => [
      r.student?.name, r.student?.pinNumber, r.student?.branch, r.student?.semester,
      r.totalWorkingDays, r.daysPresent, r.daysHalfDay, r.daysAbsent,
      r.attendancePercentage + '%'
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `attendance_${MONTHS[month-1]}_${year}.csv`; a.click();
  };

  const pctColor = p => p >= 75 ? '#2e7d32' : p >= 60 ? '#f57f17' : '#c62828';

  return (
    <div className="page fade-in">
      <h1 style={{marginBottom:8}}>Monthly Reports </h1>
      <p style={{color:'var(--gov-muted)',marginBottom:28}}>Generate and download attendance reports by month.</p>

      <div className="card" style={{padding:24,marginBottom:24}}>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'flex-end'}}>
          <div className="form-group" style={{flex:1,minWidth:140}}>
            <label className="form-label">Month</label>
            <select className="form-input" value={month} onChange={e => setMonth(+e.target.value)}>
              {MONTHS.map((m,i) => <option key={i} value={i+1}>{m}</option>)}
            </select>
          </div>
          <div className="form-group" style={{flex:1,minWidth:100}}>
            <label className="form-label">Year</label>
            <select className="form-input" value={year} onChange={e => setYear(+e.target.value)}>
              {[2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="form-group" style={{flex:1,minWidth:120}}>
            <label className="form-label">Branch</label>
            <select className="form-input" value={branch} onChange={e => setBranch(e.target.value)}>
              <option value="">All Branches</option>
              {['CS','ME','CE','EE','EC','IT','CH'].map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" style={{padding:'12px 24px'}} onClick={fetchReport} disabled={loading}>
            {loading ? '...' : ' Generate Report'}
          </button>
          {report?.length > 0 && (
            <button className="btn btn-accent" style={{padding:'12px 20px'}} onClick={exportCSV}> Export CSV</button>
          )}
        </div>
      </div>

      {report && (
        <div className="card" style={{overflow:'auto'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid var(--gov-border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <strong>{MONTHS[month-1]} {year} — {report.length} students</strong>
          </div>
          <table className="report-table">
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>PIN</th><th>Branch</th><th>Sem</th>
                <th>Working</th><th>Present</th><th>Half Day</th><th>Absent</th><th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {report.map((r, i) => (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td style={{fontWeight:600}}>{r.student?.name}</td>
                  <td style={{fontFamily:'monospace'}}>{r.student?.pinNumber}</td>
                  <td>{r.student?.branch}</td>
                  <td>{r.student?.semester}</td>
                  <td>{r.totalWorkingDays}</td>
                  <td style={{color:'#2e7d32',fontWeight:600}}>{r.daysPresent}</td>
                  <td style={{color:'#0d47a1'}}>{r.daysHalfDay}</td>
                  <td style={{color:'#c62828'}}>{r.daysAbsent}</td>
                  <td style={{fontWeight:800,color:pctColor(r.attendancePercentage)}}>{r.attendancePercentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
