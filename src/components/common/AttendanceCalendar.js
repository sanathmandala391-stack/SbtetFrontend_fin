import React from 'react';
import './AttendanceCalendar.css';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const STATUS_INFO = {
  P: { label: 'Present', color: '#2e7d32', bg: '#e8f5e9' },
  A: { label: 'Absent', color: '#c62828', bg: '#ffebee' },
  E: { label: 'Error (Partial)', color: '#e65100', bg: '#fff3e0' },
  HD: { label: 'Half Day', color: '#0d47a1', bg: '#e3f2fd' },
  W: { label: 'Weekend', color: '#4a148c', bg: '#f3e5f5' },
  H: { label: 'Holiday', color: '#880e4f', bg: '#fce4ec' },
  '-': { label: 'No Data', color: '#546e7a', bg: '#eceff1' }
};

export default function AttendanceCalendar({ monthlyData = [], stats }) {
  return (
    <div className="att-calendar">
      {stats && (
        <div className="att-stats-bar">
          <div className="att-stat">
            <span className="att-stat-val">{stats.totalWorkingDays || stats.workingDays || 0}</span>
            <span className="att-stat-label">Working Days</span>
          </div>
          <div className="att-stat">
            <span className="att-stat-val" style={{ color: '#2e7d32' }}>{stats.totalPresent || stats.presentDays || 0}</span>
            <span className="att-stat-label">Days Present</span>
          </div>
          <div className="att-stat">
            <span className="att-stat-val" style={{ color: '#0d47a1' }}>{stats.totalHalf || stats.halfDays || 0}</span>
            <span className="att-stat-label">Half Days</span>
          </div>
          <div className="att-stat">
            <span className="att-stat-val" style={{ color: parseFloat(stats.overallPercentage || stats.percentage) >= 75 ? '#2e7d32' : '#c62828' }}>
              {stats.overallPercentage || stats.percentage || 0}%
            </span>
            <span className="att-stat-label">Attendance %</span>
          </div>
        </div>
      )}

      <div className="att-legend">
        {Object.entries(STATUS_INFO).filter(([k]) => k !== '-').map(([k, v]) => (
          <span key={k} className="legend-item" style={{ background: v.bg, color: v.color }}>
            {k} — {v.label}
          </span>
        ))}
      </div>

      <div className="months-grid">
        {monthlyData.map((m, idx) => (
          <MonthTable key={idx} data={m} />
        ))}
      </div>
    </div>
  );
}

function MonthTable({ data }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div className="month-table card">
      <div className="month-header">
        <span>{MONTH_NAMES[(data.month || 1) - 1]} {data.year}</span>
      </div>
      <div className="month-grid">
        {days.map(d => {
          const status = data.days?.[d] || '-';
          const info = STATUS_INFO[status] || STATUS_INFO['-'];
          return (
            <div key={d} className="day-cell" style={{ background: info.bg, color: info.color }} title={`Day ${d}: ${info.label}`}>
              <span className="day-num">{d}</span>
              <span className="day-status">{status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
