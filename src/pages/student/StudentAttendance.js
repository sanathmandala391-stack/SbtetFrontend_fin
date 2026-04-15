// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../utils/api';

// const MONTH_NAMES = ['January','February','March','April','May','June',
//   'July','August','September','October','November','December'];

// const STATUS_COLOR = {
//   P:  { color: '#2e7d32', bg: 'transparent' },
//   A:  { color: '#c62828', bg: 'transparent' },
//   H:  { color: '#0d47a1', bg: 'transparent' },
//   W:  { color: '#555',    bg: 'transparent' },
//   HD: { color: '#e65100', bg: 'transparent' },
//   E:  { color: '#e65100', bg: 'transparent' },
//   '-':{ color: '#aaa',    bg: 'transparent' },
// };

// export default function StudentAttendance() {
//   const { user } = useAuth();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get('/student/attendance').then(r => {
//       setData(r.data);
//     }).finally(() => setLoading(false));
//   }, []);

//   if (loading) return (
//     <div className="page" style={{display:'flex',justifyContent:'center',alignItems:'center',height:'60vh'}}>
//       <div className="spinner"/>
//     </div>
//   );

//   const stats = data?.stats || {};
//   const monthlyData = data?.monthlyData || [];
//   const studentInfo = data?.student || {};

//   const workingDays = stats.workingDays || 0;
//   const presentDays = stats.presentDays || 0;
//   const halfDays = stats.halfDays || 0;
//   const absentDays = stats.absentDays || 0;
//   const percentage = stats.percentage || 0;

//   // Effective present = present + 0.5*halfday
//   const effectivePresent = presentDays + halfDays * 0.5;
//   const pctNum = parseFloat(percentage);
//   const pctColor = pctNum >= 75 ? '#2e7d32' : pctNum >= 65 ? '#f57f17' : '#c62828';
//   const status = pctNum >= 75 ? 'ELIGIBLE' : pctNum >= 65 ? 'CONDONATION' : 'DETAINED';
//   const statusColor = pctNum >= 75 ? '#2e7d32' : pctNum >= 65 ? '#e65100' : '#c62828';
//   const statusMsg = pctNum >= 75
//     ? 'Eligible for Examination'
//     : pctNum >= 65
//     ? 'May apply for Condonation (fee required)'
//     : 'Detained — Below 65% attendance';

//   return (
//     <div className="page fade-in" style={{maxWidth:1100,margin:'0 auto'}}>

//       {/* Header */}
//       <div style={{textAlign:'center',marginBottom:20,padding:'16px 0'}}>
//         <div style={{fontSize:13,fontWeight:700,color:'#1a237e',letterSpacing:1,textTransform:'uppercase'}}>
//           State Board of Technical Education and Training Telangana
//         </div>
//         <div style={{fontSize:20,fontWeight:800,color:'#1a237e',marginTop:4,letterSpacing:.5}}>
//           STUDENT ATTENDANCE SUMMARY
//         </div>
//       </div>

//       {/* Student Info Table */}
//       <table style={{width:'100%',borderCollapse:'collapse',marginBottom:2,fontSize:13}}>
//         <tbody>
//           <tr>
//             <td style={th}>PIN</td>
//             <td style={th}>NAME</td>
//             <td style={th}>ATTENDEEID</td>
//           </tr>
//           <tr>
//             <td style={td}>{user.pinNumber || studentInfo.pinNumber || '—'}</td>
//             <td style={td}>{user.name}</td>
//             <td style={td}>{studentInfo.attendeeId || user.attendeeId || '—'}</td>
//           </tr>
//           <tr>
//             <td style={th}>COLLEGE CODE</td>
//             <td style={th}>BRANCH CODE</td>
//             <td style={th}>SEMESTER</td>
//           </tr>
//           <tr>
//             <td style={td}>{user.collegeCode || studentInfo.collegeCode || '—'}</td>
//             <td style={td}>{user.branch || studentInfo.branch || '—'}</td>
//             <td style={td}>{user.semester || studentInfo.semester || '—'}</td>
//           </tr>
//         </tbody>
//       </table>

//       {/* Stats Table */}
//       <table style={{width:'100%',borderCollapse:'collapse',marginBottom:2,fontSize:13}}>
//         <tbody>
//           <tr>
//             <td style={th}>WORKING DAYS</td>
//             <td style={th}>NUMBER OF DAYS PRESENT</td>
//             <td style={th}>ATTENDANCE PERCENTAGE (%)</td>
//             <td style={th}>ATTENDANCE CALCULATED</td>
//           </tr>
//           <tr>
//             <td style={td}>{workingDays}</td>
//             <td style={td}>{effectivePresent}</td>
//             <td style={{...td, color: pctColor, fontWeight:800, fontSize:16}}>{pctNum.toFixed(2)}</td>
//             <td style={td}>{new Date().toLocaleString('en-IN')}</td>
//           </tr>
//           <tr>
//             <td style={th}>TOTAL WORKING DAYS (EXAMS)</td>
//             <td style={th}>TOTAL PRESENT DAYS (EXAMS)</td>
//             <td style={{...th, colSpan:2}}>ATTENDANCE % FOR EXAMINATION</td>
//             <td style={th}></td>
//           </tr>
//           <tr>
//             <td style={td}>{workingDays}</td>
//             <td style={td}>{effectivePresent}</td>
//             <td style={{...td, color: pctColor, fontWeight:800, fontSize:16, colSpan:2}}>{pctNum.toFixed(2)}</td>
//             <td style={td}></td>
//           </tr>
//         </tbody>
//       </table>

//       {/* Status Banner */}
//       <div style={{
//         padding:'10px 20px', marginBottom:8, borderRadius:0,
//         background: pctNum >= 75 ? '#e8f5e9' : pctNum >= 65 ? '#fff3e0' : '#ffebee',
//         border: `2px solid ${statusColor}`,
//         color: statusColor, fontWeight:700, fontSize:14, textAlign:'center'
//       }}>
//         {status} — {statusMsg}
//         {pctNum < 75 && pctNum >= 65 && (
//           <span style={{marginLeft:12,fontSize:12,fontWeight:400}}>
//             Need {(75 - pctNum).toFixed(2)}% more to reach 75%
//           </span>
//         )}
//         {pctNum < 65 && (
//           <span style={{marginLeft:12,fontSize:12,fontWeight:400}}>
//             Need {(75 - pctNum).toFixed(2)}% more to reach 75%
//           </span>
//         )}
//       </div>

//       {/* Monthly Attendance Grid */}
//       {monthlyData.length > 0 ? (
//         <div style={{overflowX:'auto',marginBottom:16}}>
//           <table style={{width:'100%',borderCollapse:'collapse',fontSize:12,minWidth:900}}>
//             <thead>
//               <tr>
//                 <td style={{...th, width:28}}>#</td>
//                 <td style={{...th, width:80}}>Month</td>
//                 {Array.from({length:31},(_,i)=>i+1).map(d=>(
//                   <td key={d} style={{...th, width:28, textAlign:'center', padding:'4px 2px'}}>{String(d).padStart(2,'0')}</td>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {monthlyData.map((m, idx) => (
//                 <tr key={idx}>
//                   <td style={{...td, textAlign:'center', fontWeight:700}}>{idx+1}</td>
//                   <td style={{...td, fontWeight:600}}>{MONTH_NAMES[(m.month||1)-1]}</td>
//                   {Array.from({length:31},(_,i)=>i+1).map(d => {
//                     const s = m.days?.[d] || '-';
//                     const sc = STATUS_COLOR[s] || STATUS_COLOR['-'];
//                     return (
//                       <td key={d} style={{
//                         ...td, textAlign:'center', padding:'4px 2px',
//                         color: sc.color, fontWeight: s !== '-' && s !== 'W' ? 700 : 400,
//                         fontSize: 11
//                       }}>
//                         {s === 'HD' ? 'HP' : s}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div style={{textAlign:'center',padding:48,color:'var(--gov-muted)'}}>
//           No attendance records found yet.
//         </div>
//       )}

//       {/* Legend */}
//       <div style={{display:'flex',gap:24,flexWrap:'wrap',padding:'12px 0',fontSize:13,fontWeight:600}}>
//         <span style={{color:'#2e7d32'}}>P — Present</span>
//         <span style={{color:'#c62828'}}>A — Absent</span>
//         <span style={{color:'#0d47a1'}}>H — Holiday</span>
//         <span style={{color:'#555'}}>W — Weekend</span>
//         <span style={{color:'#e65100'}}>HP — Half Day Present</span>
//         <span style={{color:'#e65100'}}>E — Error/Partial</span>
//       </div>

//       {/* Breakdown */}
//       <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:8}}>
//         {[
//           {label:'Present Days', val: presentDays, color:'#2e7d32'},
//           {label:'Half Days', val: halfDays, color:'#e65100'},
//           {label:'Absent Days', val: absentDays, color:'#c62828'},
//           {label:'Working Days', val: workingDays, color:'#1a237e'},
//           {label:'Attendance %', val: pctNum.toFixed(2)+'%', color: pctColor},
//         ].map((s,i) => (
//           <div key={i} style={{
//             flex:1, minWidth:120, padding:'14px 16px',
//             background:'#fff', border:'1px solid #e0e0e0',
//             borderTop: `3px solid ${s.color}`, borderRadius:6, textAlign:'center'
//           }}>
//             <div style={{fontSize:22,fontWeight:800,color:s.color}}>{s.val}</div>
//             <div style={{fontSize:11,color:'#666',marginTop:4,textTransform:'uppercase',letterSpacing:.5}}>{s.label}</div>
//           </div>
//         ))}
//       </div>

//       {/* Print Button */}
//       <div style={{textAlign:'right',marginTop:24}}>
//         <button className="btn btn-primary" style={{padding:'10px 32px'}} onClick={() => window.print()}>
//            Print
//         </button>
//       </div>

//     </div>
//   );
// }

// // Table cell styles
// const th = {
//   border: '1px solid #bbb',
//   background: '#e8eaf6',
//   padding: '7px 10px',
//   fontWeight: 700,
//   fontSize: 12,
//   textTransform: 'uppercase',
//   letterSpacing: 0.3,
//   color: '#1a237e',
//   textAlign: 'center'
// };
// const td = {
//   border: '1px solid #bbb',
//   padding: '7px 10px',
//   textAlign: 'center',
//   fontSize: 13,
//   color: '#222',
//   background: '#fff'
// };



//previous//

//second//

// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../utils/api';

// const MONTH_NAMES = [
//   'January','February','March','April','May','June',
//   'July','August','September','October','November','December'
// ];

// // SBTET colour coding (matches official portal)
// const STATUS_COLOR = {
//   P:  '#2e7d32',   // green
//   A:  '#c62828',   // red
//   H:  '#0d47a1',   // blue
//   HP: '#e65100',   // orange  (halfday shown as HP)
//   E:  '#e65100',   // orange  (error/partial)
//   W:  '#757575',   // grey
//   '-':'#bdbdbd',   // light grey
// };

// function getAttendanceCalculatedTime() {
//   const d = new Date();
//   d.setHours(5, 0, 0, 0);  // 5:00:00 AM today
//   return d;                  // e.g. "4 Apr 2026, 05:00 AM"
// }

// export default function StudentAttendance() {
//   const { user }           = useAuth();
//   const [data, setData]    = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get('/student/attendance')
//       .then(r => setData(r.data))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return (
//     <div className="page" style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}>
//       <div className="spinner" />
//     </div>
//   );

//   const stats       = data?.stats       || {};
//   const monthlyData = data?.monthlyData || [];
//   const studentInfo = data?.student     || {};

//   //  Core numbers 
//   const workingDays      = stats.workingDays      || 0;
//   const effectivePresent = stats.effectivePresent || 0;  // present + halfDays
//   const presentDays      = stats.presentDays      || 0;
//   const halfDays         = stats.halfDays         || 0;
//   const absentDays       = stats.absentDays       || 0;
//   const percentage       = parseFloat(stats.percentage || 0);

//   //  Detention status 
//   const detentionStatus = stats.detentionStatus ||
//     (percentage >= 75 ? 'ELIGIBLE' : percentage >= 65 ? 'CONDONATION' : 'DETAINED');

//   const statusColors = {
//     ELIGIBLE:     { bg:'#e8f5e9', border:'#2e7d32', text:'#2e7d32' },
//     CONDONATION:  { bg:'#fff3e0', border:'#e65100', text:'#e65100' },
//     DETAINED:     { bg:'#ffebee', border:'#c62828', text:'#c62828' },
//   };
//   const sc = statusColors[detentionStatus] || statusColors.DETAINED;
//   const pctColor = percentage >= 75 ? '#2e7d32' : percentage >= 65 ? '#e65100' : '#c62828';

//   // Days needed to reach 75%
//   //   0.75 = (effectivePresent + x) / (workingDays + x)  →  x = (0.75*workingDays - effectivePresent) / 0.25
//   const daysToEligible = workingDays > 0
//     ? Math.ceil((0.75 * workingDays - effectivePresent) / 0.25)
//     : 0;

//   return (
//     <div className="page fade-in" style={{ maxWidth:1120, margin:'0 auto', padding:'24px 16px 80px', fontFamily:'Arial, sans-serif' }}>

//       {/*  Official Header  */}
//       <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:18, marginBottom:16, paddingBottom:12, borderBottom:'2px solid #1a237e' }}>
//         <img
//           src="https://www.sbtet.telangana.gov.in/SBTET/images/SBTET%20LOGO.png"
//           alt="SBTET Logo"
//           style={{ height:64, objectFit:'contain' }}
//           onError={e => { e.target.style.display='none'; }}
//         />
//         <div style={{ textAlign:'center' }}>
//           <div style={{ fontSize:14, fontWeight:700, color:'#1a237e', letterSpacing:.5 }}>
//             STATE BOARD OF TECHNICAL EDUCATION AND TRAINING TELANGANA
//           </div>
//           <div style={{ fontSize:22, fontWeight:800, color:'#1a7f3c', marginTop:4, letterSpacing:1 }}>
//             STUDENT ATTENDANCE SUMMARY
//           </div>
//         </div>
//       </div>

//       {/*  Student Info  */}
//       <table style={tableStyle}>
//         <tbody>
//           <tr>
//             <td style={hCell}>PIN</td>
//             <td style={hCell}>NAME</td>
//             <td style={hCell}>ATTENDEEID</td>
//           </tr>
//           <tr>
//             <td style={dCell}>{studentInfo.pinNumber || user.pinNumber || '—'}</td>
//             <td style={dCell}>{user.name || studentInfo.name}</td>
//             <td style={dCell}>{studentInfo.attendeeId || user.attendeeId || '—'}</td>
//           </tr>
//           <tr>
//             <td style={hCell}>COLLEGE CODE</td>
//             <td style={hCell}>BRANCH CODE</td>
//             <td style={hCell}>SEMESTER</td>
//           </tr>
//           <tr>
//             <td style={dCell}>{studentInfo.collegeCode || user.collegeCode || '—'}</td>
//             <td style={dCell}>{studentInfo.branch      || user.branch      || '—'}</td>
//             <td style={dCell}>{studentInfo.semester    || user.semester    || '—'}</td>
//           </tr>
//         </tbody>
//       </table>

//       {/*  Attendance Stats  */}
//       <table style={tableStyle}>
//         <tbody>
//           <tr>
//             <td style={hCell}>WORKING DAYS</td>
//             <td style={hCell}>NUMBER OF DAYS PRESENT</td>
//             <td style={hCell}>ATTENDANCE PERCENTAGE (%)</td>
//             <td style={hCell}>ATTENDANCE CALCULATED</td>
//           </tr>
//           <tr>
//             <td style={dCell}>{workingDays}</td>
//             <td style={dCell}>{effectivePresent}</td>
//             <td style={{ ...dCell, color:pctColor, fontWeight:800, fontSize:17 }}>
//               {percentage.toFixed(2)}
//             </td>
//             <td style={{ ...dCell, fontSize:12 }}>
//               {getAttendanceCalculatedTime().toLocaleString('en-IN', {
//                 day:'numeric', month:'short', year:'numeric',
//                 hour:'2-digit', minute:'2-digit', hour12:true
//               })}
//             </td>
//           </tr>

//           <tr>
//             <td style={hCell}>TOTAL WORKING DAYS CONSIDERED FOR EXAMS</td>
//             <td style={hCell}>TOTAL PRESENT DAYS CONSIDERED FOR EXAMS</td>
//             <td style={{ ...hCell, colSpan:2 }}>ATTENDANCE % TO BE CONSIDERED FOR EXAMINATION</td>
//             <td style={hCell} />
//           </tr>
//           <tr>
//             <td style={dCell}>{workingDays}</td>
//             <td style={dCell}>{effectivePresent}</td>
//             <td style={{ ...dCell, color:pctColor, fontWeight:800, fontSize:17, colSpan:2 }}>
//               {percentage.toFixed(2)}
//             </td>
//             <td style={dCell} />
//           </tr>
//         </tbody>
//       </table>

//       {/*  Status Banner  */}
//       <div style={{
//         padding:'12px 20px', marginBottom:10,
//         background:sc.bg, border:`2px solid ${sc.border}`,
//         color:sc.text, fontWeight:700, fontSize:14, textAlign:'center',
//         borderRadius:4
//       }}>
//         {detentionStatus === 'ELIGIBLE' && ' ELIGIBLE FOR EXAMINATION — Attendance ≥ 75%'}
//         {detentionStatus === 'CONDONATION' && (
//           <>
//              CONDONATION — Attendance between 65%–75%. You may pay condonation fee.&nbsp;
//             <span style={{ fontWeight:400, fontSize:12 }}>
//               Need {daysToEligible > 0 ? daysToEligible : 0} more present day(s) to reach 75%.
//             </span>
//           </>
//         )}
//         {detentionStatus === 'DETAINED' && (
//           <>
//              DETAINED — Attendance below 65%. Not eligible for examination.&nbsp;
//             <span style={{ fontWeight:400, fontSize:12 }}>
//               Need {daysToEligible > 0 ? daysToEligible : 0} more present day(s) to reach 75%.
//             </span>
//           </>
//         )}
//       </div>

//       {/*  Monthly Grid (SBTET Table)  */}
//       {monthlyData.length > 0 ? (
//         <div style={{ overflowX:'auto', marginBottom:16 }}>
//           <table style={{ ...tableStyle, minWidth:960 }}>
//             <thead>
//               <tr>
//                 <td style={{ ...hCell, width:30 }}>#</td>
//                 <td style={{ ...hCell, width:82, textAlign:'left', paddingLeft:10 }}>Month</td>
//                 {Array.from({ length:31 }, (_, i) => i + 1).map(d => (
//                   <td key={d} style={{ ...hCell, width:30, padding:'5px 2px', fontSize:11 }}>
//                     {String(d).padStart(2,'0')}
//                   </td>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {monthlyData.map((m, idx) => (
//                 <tr key={idx}>
//                   <td style={{ ...dCell, textAlign:'center', fontWeight:700 }}>{idx + 1}</td>
//                   <td style={{ ...dCell, textAlign:'left', paddingLeft:10, fontWeight:600, whiteSpace:'nowrap' }}>
//                     {MONTH_NAMES[(m.month || 1) - 1]}
//                   </td>
//                   {Array.from({ length:31 }, (_, i) => i + 1).map(d => {
//                     const s   = m.days?.[d] || '-';
//                     const col = STATUS_COLOR[s] || STATUS_COLOR['-'];
//                     const bold = s !== '-' && s !== 'W';
//                     return (
//                       <td key={d} style={{
//                         ...dCell,
//                         textAlign:'center', padding:'5px 2px',
//                         color:col, fontWeight: bold ? 700 : 400,
//                         fontSize:11
//                       }}>
//                         {s}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div style={{ textAlign:'center', padding:48, color:'#888', border:'1px solid #eee', borderRadius:8 }}>
//           No attendance records found yet. Mark your attendance to see records here.
//         </div>
//       )}

//       {/*  Legend  */}
//       <div style={{ display:'flex', gap:28, flexWrap:'wrap', padding:'10px 0', fontSize:13, fontWeight:600 }}>
//         <span style={{ color:'#2e7d32' }}>P — Present</span>
//         <span style={{ color:'#c62828' }}>A — Absent</span>
//         <span style={{ color:'#0d47a1' }}>H — Holiday</span>
//         <span style={{ color:'#757575' }}>W — Weekend</span>
//         <span style={{ color:'#e65100' }}>HP — Half Day Present</span>
//         <span style={{ color:'#e65100' }}>E — Error / Partial</span>
//       </div>

//       {/*  Breakdown Cards  */}
//       <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:12 }}>
//         {[
//           { label:'Working Days',   val: workingDays,      color:'#1a237e' },
//           { label:'Present (P)',    val: presentDays,      color:'#2e7d32' },
//           { label:'Half Days (HP)', val: halfDays,         color:'#e65100' },
//           { label:'Effective Present', val: effectivePresent, color:'#1b5e20' },
//           { label:'Absent',         val: absentDays,       color:'#c62828' },
//           { label:'Attendance %',   val: percentage.toFixed(2) + '%', color: pctColor },
//         ].map((s, i) => (
//           <div key={i} style={{
//             flex:'1 1 130px', padding:'14px 16px',
//             background:'#fff', border:'1px solid #e0e0e0',
//             borderTop:`4px solid ${s.color}`, borderRadius:6, textAlign:'center'
//           }}>
//             <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.val}</div>
//             <div style={{ fontSize:11, color:'#777', marginTop:4, textTransform:'uppercase', letterSpacing:.4 }}>
//               {s.label}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/*  Per-day impact note  */}
//       {workingDays > 0 && (
//         <div style={{
//           marginTop:14, padding:'10px 16px', background:'#f0f4ff',
//           border:'1px solid #c5cae9', borderRadius:6, fontSize:13, color:'#1a237e'
//         }}>
//            <strong>Each present day adds {(100 / workingDays).toFixed(2)}%</strong> to your attendance
//           ({workingDays} total working days so far this semester).
//           {percentage < 75 && (
//             <span>
//               &nbsp;You need <strong>{daysToEligible > 0 ? daysToEligible : 0} more present day(s)</strong> to reach 75%.
//             </span>
//           )}
//         </div>
//       )}

//       {/*  Print  */}
//       <div style={{ textAlign:'right', marginTop:24 }}>
//         <button
//           className="btn btn-primary"
//           style={{ padding:'10px 32px' }}
//           onClick={() => window.print()}
//         >
//            Print
//         </button>
//       </div>
//     </div>
//   );
// }

// //  Shared cell styles 
// const tableStyle = {
//   width:'100%', borderCollapse:'collapse', marginBottom:4, fontSize:13
// };
// const hCell = {
//   border:'1px solid #b0b8d0',
//   background:'#e8eaf6',
//   padding:'7px 10px',
//   fontWeight:700,
//   fontSize:11.5,
//   textTransform:'uppercase',
//   letterSpacing:0.3,
//   color:'#1a237e',
//   textAlign:'center'
// };
// const dCell = {
//   border:'1px solid #b0b8d0',
//   padding:'8px 10px',
//   textAlign:'center',
//   fontSize:13,
//   color:'#1a1a1a',
//   background:'#fff'
// };



//third//

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const MONTH_NAMES = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

// SBTET portal colour coding — HP added (halfday shown as HP)
const STATUS_COLOR = {
  P:   { color: '#2e7d32' },
  A:   { color: '#c62828' },
  H:   { color: '#0d47a1' },
  HP:  { color: '#e65100' },   // half day shown as HP
  W:   { color: '#757575' },
  E:   { color: '#e65100' },
  '-': { color: '#bdbdbd' },
};

export default function StudentAttendance() {
  const { user }              = useAuth();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/attendance')
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page" style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}>
      <div className="spinner" />
    </div>
  );

  const stats       = data?.stats       || {};
  const monthlyData = data?.monthlyData || [];
  const studentInfo = data?.student     || {};

  //  Read all stats fields sent by the fixed backend 
  const workingDays      = stats.workingDays      || 90;   // fixed 90
  const presentDays      = stats.presentDays      || 0;
  const halfDays         = stats.halfDays         || 0;
  const effectivePresent = stats.effectivePresent || (presentDays + halfDays);
  const absentDays       = stats.absentDays       || 0;
  const pctNum           = parseFloat(stats.percentage || 0);
  const detentionStatus  = stats.detentionStatus  ||
    (pctNum >= 75 ? 'ELIGIBLE' : pctNum >= 65 ? 'CONDONATION' : 'DETAINED');
  const daysNeededFor75  = stats.daysNeededFor75  ||
    Math.max(0, Math.ceil(0.75 * workingDays) - effectivePresent);
  const perDayImpact     = stats.perDayImpact     ||
    parseFloat((100 / workingDays).toFixed(2));

  //  lastCalculated — backend sends 05:00 AM, show that 
  const lastCalculatedStr = (() => {
    const d = stats.lastCalculated ? new Date(stats.lastCalculated) : new Date();
    // Always show 05:00 AM regardless (matches SBTET portal)
    d.setHours(5, 0, 0, 0);
    return d.toLocaleString('en-IN', {
      day:'numeric', month:'short', year:'numeric',
      hour:'2-digit', minute:'2-digit', hour12:true
    });
  })();

  const pctColor     = pctNum >= 75 ? '#2e7d32' : pctNum >= 65 ? '#e65100' : '#c62828';
  const statusStyles = {
    ELIGIBLE:    { bg:'#e8f5e9', border:'#2e7d32', text:'#2e7d32' },
    CONDONATION: { bg:'#fff3e0', border:'#e65100', text:'#e65100' },
    DETAINED:    { bg:'#ffebee', border:'#c62828', text:'#c62828' },
  };
  const sc = statusStyles[detentionStatus] || statusStyles.DETAINED;

  return (
    <div className="page fade-in" style={{ maxWidth:1100, margin:'0 auto', fontFamily:'Arial,sans-serif' }}>

      {/*  Official Header  */}
      <div style={{ textAlign:'center', marginBottom:16, padding:'14px 0', borderBottom:'2px solid #1a237e' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:14, flexWrap:'wrap' }}>
          <img
            src="https://www.sbtet.telangana.gov.in/SBTET/images/SBTET%20LOGO.png"
            alt="SBTET" style={{ height:56, objectFit:'contain' }}
            onError={e => { e.target.style.display='none'; }}
          />
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:'#1a237e', letterSpacing:1, textTransform:'uppercase' }}>
              State Board of Technical Education and Training Telangana
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:'#1a7f3c', marginTop:4, letterSpacing:.5 }}>
              STUDENT ATTENDANCE SUMMARY
            </div>
          </div>
        </div>
      </div>

      {/*  Student Info Table  */}
      <table style={tableStyle}>
        <tbody>
          <tr>
            <td style={th}>PIN</td>
            <td style={th}>NAME</td>
            <td style={th}>ATTENDEEID</td>
          </tr>
          <tr>
            <td style={td}>{user.pinNumber || studentInfo.pinNumber || '—'}</td>
            <td style={td}>{user.name || studentInfo.name}</td>
            <td style={td}>{studentInfo.attendeeId || user.attendeeId || '—'}</td>
          </tr>
          <tr>
            <td style={th}>COLLEGE CODE</td>
            <td style={th}>BRANCH CODE</td>
            <td style={th}>SEMESTER</td>
          </tr>
          <tr>
            <td style={td}>{user.collegeCode || studentInfo.collegeCode || '—'}</td>
            <td style={td}>{user.branch      || studentInfo.branch      || '—'}</td>
            <td style={td}>{user.semester    || studentInfo.semester    || '—'}</td>
          </tr>
        </tbody>
      </table>

      {/*  Stats Table  */}
      <table style={tableStyle}>
        <tbody>
          <tr>
            <td style={th}>WORKING DAYS</td>
            <td style={th}>NUMBER OF DAYS PRESENT</td>
            <td style={th}>ATTENDANCE PERCENTAGE (%)</td>
            <td style={th}>ATTENDANCE CALCULATED</td>
          </tr>
          <tr>
            <td style={td}>{workingDays}</td>
            <td style={td}>{effectivePresent}</td>
            <td style={{ ...td, color:pctColor, fontWeight:800, fontSize:16 }}>
              {pctNum.toFixed(2)}
            </td>
            {/* FIX: show 5:00 AM, not current viewing time */}
            <td style={{ ...td, fontSize:12 }}>{lastCalculatedStr}</td>
          </tr>
          <tr>
            <td style={th}>TOTAL WORKING DAYS CONSIDERED FOR EXAMS</td>
            <td style={th}>TOTAL PRESENT DAYS CONSIDERED FOR EXAMS</td>
            <td style={th} colSpan={2}>ATTENDANCE % TO BE CONSIDERED FOR EXAMINATION</td>
          </tr>
          <tr>
            <td style={td}>{workingDays}</td>
            <td style={td}>{effectivePresent}</td>
            <td style={{ ...td, color:pctColor, fontWeight:800, fontSize:16 }} colSpan={2}>
              {pctNum.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {/*  Status Banner  */}
      <div style={{
        padding:'11px 20px', marginBottom:10, borderRadius:4,
        background:sc.bg, border:`2px solid ${sc.border}`,
        color:sc.text, fontWeight:700, fontSize:14, textAlign:'center'
      }}>
        {detentionStatus === 'ELIGIBLE' && ' ELIGIBLE FOR EXAMINATION — Attendance ≥ 75%'}
        {detentionStatus === 'CONDONATION' && (
          <> CONDONATION — Between 65%–75%. You may pay condonation fee.
            <span style={{ fontWeight:400, fontSize:12, marginLeft:8 }}>
              Need {daysNeededFor75} more present day(s) to reach 75%.
            </span>
          </>
        )}
        {detentionStatus === 'DETAINED' && (
          <> DETAINED — Attendance below 65%. Not eligible for examination.
            <span style={{ fontWeight:400, fontSize:12, marginLeft:8 }}>
              Need {daysNeededFor75} more present day(s) to reach 75%.
            </span>
          </>
        )}
      </div>

      {/*  Monthly Attendance Grid  */}
      {monthlyData.length > 0 ? (
        <div style={{ overflowX:'auto', marginBottom:16 }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12, minWidth:900 }}>
            <thead>
              <tr>
                <td style={{ ...th, width:28 }}>#</td>
                <td style={{ ...th, width:80, textAlign:'left', paddingLeft:10 }}>Month</td>
                {Array.from({ length:31 }, (_, i) => i + 1).map(d => (
                  <td key={d} style={{ ...th, width:28, textAlign:'center', padding:'4px 2px' }}>
                    {String(d).padStart(2,'0')}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((m, idx) => (
                <tr key={idx}>
                  <td style={{ ...td, textAlign:'center', fontWeight:700 }}>{idx + 1}</td>
                  <td style={{ ...td, fontWeight:600, textAlign:'left', paddingLeft:10, whiteSpace:'nowrap' }}>
                    {MONTH_NAMES[(m.month || 1) - 1]}
                  </td>
                  {Array.from({ length:31 }, (_, i) => i + 1).map(d => {
                    //  KEY FIX: read using String(d) because backend sends
                    //    string keys "5":"P" not integer keys 5:"P"
                    //    Without this fix, m.days?.[5] → undefined → shows "-"
                    //    even when today's attendance IS present in the data.
                    const s  = m.days?.[String(d)] || '-';
                    const sc = STATUS_COLOR[s] || STATUS_COLOR['-'];
                    return (
                      <td key={d} style={{
                        ...td, textAlign:'center', padding:'4px 2px',
                        color:sc.color,
                        fontWeight: s !== '-' && s !== 'W' ? 700 : 400,
                        fontSize:11
                      }}>
                        {s}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign:'center', padding:48, color:'#888', border:'1px solid #eee', borderRadius:8 }}>
          No attendance records found yet. Mark your attendance to see records here.
        </div>
      )}

      {/*  Legend  */}
      <div style={{ display:'flex', gap:24, flexWrap:'wrap', padding:'10px 0', fontSize:13, fontWeight:600 }}>
        <span style={{ color:'#2e7d32' }}>P — Present</span>
        <span style={{ color:'#c62828' }}>A — Absent</span>
        <span style={{ color:'#0d47a1' }}>H — Holiday</span>
        <span style={{ color:'#757575' }}>W — Weekend</span>
        <span style={{ color:'#e65100' }}>HP — Half Day Present</span>
        <span style={{ color:'#e65100' }}>E — Error / Partial</span>
      </div>

      {/*  Breakdown cards  */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:10 }}>
        {[
          { label:'Working Days',      val: workingDays,                  color:'#1a237e' },
          { label:'Present (P)',        val: presentDays,                  color:'#2e7d32' },
          { label:'Half Days (HP)',     val: halfDays,                     color:'#e65100' },
          { label:'Effective Present',  val: effectivePresent,             color:'#1b5e20' },
          { label:'Absent',             val: absentDays,                   color:'#c62828' },
          { label:'Attendance %',       val: pctNum.toFixed(2) + '%',      color: pctColor },
        ].map((s, i) => (
          <div key={i} style={{
            flex:'1 1 110px', padding:'13px 12px', textAlign:'center',
            background:'#fff', border:'1px solid #e0e0e0',
            borderTop:`3px solid ${s.color}`, borderRadius:6
          }}>
            <div style={{ fontSize:20, fontWeight:800, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:10, color:'#777', marginTop:3, textTransform:'uppercase', letterSpacing:.4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/*  Per-day impact note  */}
      <div style={{
        marginTop:12, padding:'10px 16px',
        background:'#f0f4ff', border:'1px solid #c5cae9', borderRadius:6,
        fontSize:13, color:'#1a237e'
      }}>
         <strong>Each present day adds {perDayImpact}%</strong> to your attendance
        ({workingDays} total working days this semester).
        {pctNum < 75 && (
          <span>
            &nbsp;You need <strong>{daysNeededFor75} more present day(s)</strong> to reach 75%.
          </span>
        )}
      </div>

      {/*  Print  */}
      <div style={{ textAlign:'right', marginTop:20 }}>
        <button className="btn btn-primary" style={{ padding:'10px 32px' }} onClick={() => window.print()}>
           Print
        </button>
      </div>

    </div>
  );
}

//  Shared cell styles 
const tableStyle = { width:'100%', borderCollapse:'collapse', marginBottom:4, fontSize:13 };

const th = {
  border:'1px solid #b0b8d0', background:'#e8eaf6',
  padding:'7px 10px', fontWeight:700, fontSize:11.5,
  textTransform:'uppercase', letterSpacing:0.3,
  color:'#1a237e', textAlign:'center'
};

const td = {
  border:'1px solid #b0b8d0', padding:'7px 10px',
  textAlign:'center', fontSize:13, color:'#1a1a1a', background:'#fff'
};