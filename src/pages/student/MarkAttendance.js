// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import api from '../../utils/api';
// import { useAuth } from '../../context/AuthContext';
// import FaceCamera from '../../components/common/FaceCamera';
// import './StudentPages.css';

// export default function MarkAttendance() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [todayRecord, setTodayRecord] = useState(null);
//   const [location, setLocation] = useState(null);
//   const [locationStatus, setLocationStatus] = useState('checking');
//   const [locationMsg, setLocationMsg] = useState('Getting your location...');
//   const [showCamera, setShowCamera] = useState(false);
//   const [action, setAction] = useState('checkin'); // 'checkin' | 'checkout'
//   const [loading, setLoading] = useState(true);
//   const [done, setDone] = useState(null);

//   useEffect(() => {
//     api.get('/attendance/today').then(r => {
//       setTodayRecord(r.data.record);
//       if (r.data.record?.status === 'E') setAction('checkout');
//       if (r.data.record && r.data.record.status !== 'E') {
//         setDone({ status: r.data.record.status, message: 'Attendance already marked for today.' });
//       }
//     }).finally(() => setLoading(false));
//     getLocation();
//   }, []);

//   const getLocation = () => {
//     setLocationStatus('checking');
//     setLocationMsg('Getting your location...');
//     if (!navigator.geolocation) {
//       setLocationStatus('outside');
//       setLocationMsg('Geolocation not supported by your browser.');
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       pos => {
//         setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
//         setLocationStatus('inside'); // actual check happens on API call
//         setLocationMsg(`Location acquired. Distance check will happen on submission.`);
//       },
//       () => {
//         setLocationStatus('outside');
//         setLocationMsg('Location access denied. Please allow location access.');
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   };

//   const handleFaceVerified = async (success, descriptor) => {
//     if (!success) { toast.error('Face verification failed.'); return; }
//     if (!location) { toast.error('Location not available.'); return; }
//     setLoading(true);
//     try {
//       const endpoint = action === 'checkin' ? '/attendance/checkin' : '/attendance/checkout';
//       const res = await api.post(endpoint, {
//         latitude: location.latitude,
//         longitude: location.longitude,
//         faceVerified: true
//       });
//       toast.success(res.data.message);
//       setDone({ status: action === 'checkin' ? 'E' : 'P', message: res.data.message });
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Failed. Please try again.';
//       toast.error(msg);
//       if (msg.toLowerCase().includes('outside')) {
//         setLocationStatus('outside');
//         setLocationMsg(msg);
//       }
//       setShowCamera(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !todayRecord) {
//     return <div className="page" style={{display:'flex',justifyContent:'center',alignItems:'center',height:'60vh'}}><div className="spinner"/></div>;
//   }

//   if (done) {
//     const colors = { E: '#e65100', P: '#2e7d32', HD: '#0d47a1', A: '#c62828' };
//     return (
//       <div className="page">
//         <div className="mark-container">
//           <div className="mark-card card" style={{textAlign:'center',alignItems:'center'}}>
//             <div style={{fontSize:64}}>
//               {done.status === 'P' ? '' : done.status === 'E' ? '' : ''}
//             </div>
//             <h2 style={{color: colors[done.status] || 'var(--blue-dark)'}}>{done.message}</h2>
//             {done.status === 'E' && (
//               <p style={{color:'var(--gov-muted)',fontSize:14}}>
//                 Remember to check out after 6 hours from your check-in time for full attendance.
//               </p>
//             )}
//             <button className="btn btn-primary" style={{marginTop:16}} onClick={() => navigate('/student')}>
//               Back to Dashboard
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="page fade-in">
//       <div style={{ background:'#1a237e', color:'#fff', padding:'10px 18px', borderRadius:'4px 4px 0 0', marginBottom:0 }}>
      //   <span style={{ fontSize:15, fontWeight:700 }}> Mark Attendance</span>
      // </div>
      // <div style={{ background:'#e8eaf6', padding:'7px 16px', fontSize:12, color:'#546e7a', borderBottom:'1px solid #dee2e6', marginBottom:16 }}>
      //   Home › Student › Mark Attendance
      // </div>
//       <p style={{color:'var(--gov-muted)',marginBottom:32}}>
//         {action === 'checkin' ? 'Check in for today' : 'Check out — end your attendance'}
//       </p>

//       <div className="mark-container">
//         <div className="mark-card card">
//           {/* Step 1: Location */}
//           <div className="mark-step">
//             <div className="mark-step-title">
//               <div className="step-num-circle">1</div>
//               GPS Location Check
//             </div>
//             <div className={`location-status ${locationStatus}`}>
//               {locationStatus === 'checking' && ' '}
//               {locationStatus === 'inside' && ' '}
//               {locationStatus === 'outside' && ' '}
//               {locationMsg}
//             </div>
//             {locationStatus === 'outside' && (
//               <button className="btn btn-outline" onClick={getLocation} style={{alignSelf:'flex-start'}}>
//                  Retry Location
//               </button>
//             )}
//           </div>

//           {/* Step 2: Face */}
//           <div className="mark-step">
//             <div className="mark-step-title">
//               <div className="step-num-circle">2</div>
//               Face Biometric Verification
//             </div>
//             {!showCamera ? (
//               <button
//                 className="btn btn-primary"
//                 disabled={locationStatus !== 'inside'}
//                 onClick={() => setShowCamera(true)}
//                 style={{padding:'14px 28px', fontSize:16}}
//               >
//                  Start Face Verification
//               </button>
//             ) : (
//               <FaceCamera
//                 mode="verify"
//                 storedDescriptor={user.faceDescriptor}
//                 onVerified={handleFaceVerified}
//               />
//             )}
//             <p style={{fontSize:13,color:'var(--gov-muted)'}}>
//               Look at the camera and blink twice to verify your identity. Photos and videos will not work.
//             </p>
//           </div>

//           {/* Current action info */}
//           <div style={{padding:'16px',background:'var(--bg)',borderRadius:10,fontSize:14,color:'var(--gov-muted)'}}>
//             <strong style={{color:'var(--text)'}}>Action:</strong>{' '}
//             {action === 'checkin' ? '🟢 Check In (First mark for today)' : ' Check Out (Must be 6+ hrs after check-in for full attendance)'}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




//new Second//

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import api from '../../utils/api';
// import { useAuth } from '../../context/AuthContext';
// import FaceCamera from '../../components/common/FaceCamera';
// import './StudentPages.css';

// export default function MarkAttendance() {
//   const { user }    = useAuth();
//   const navigate    = useNavigate();

//   const [todayRecord,     setTodayRecord]     = useState(null);
//   const [location,        setLocation]        = useState(null);
//   const [locationStatus,  setLocationStatus]  = useState('checking');
//   const [locationMsg,     setLocationMsg]     = useState('Getting your location...');
//   const [showCamera,      setShowCamera]      = useState(false);
//   const [action,          setAction]          = useState('checkin');
//   const [loading,         setLoading]         = useState(true);
//   const [done,            setDone]            = useState(null);

//   useEffect(() => {
//     api.get('/attendance/today').then(r => {
//       setTodayRecord(r.data.record);
//       if (r.data.record?.status === 'E') setAction('checkout');
//       if (r.data.record && r.data.record.status !== 'E') {
//         setDone({ status: r.data.record.status, message: 'Attendance already marked for today.' });
//       }
//     }).finally(() => setLoading(false));
//     getLocation();
//   }, []);

//   const getLocation = () => {
//     setLocationStatus('checking');
//     setLocationMsg('Getting your location...');
//     if (!navigator.geolocation) {
//       setLocationStatus('error');
//       setLocationMsg('Geolocation not supported by your browser.');
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       pos => {
//         setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
//         setLocationStatus('ok');
//         setLocationMsg('Location acquired ');
//       },
//       () => {
//         setLocationStatus('error');
//         setLocationMsg('Location access denied. Please allow location and retry.');
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   };

//   const handleFaceVerified = async (success) => {
//     if (!success) { toast.error('Face verification failed.'); return; }
//     if (!location) { toast.error('Location not available.'); return; }
//     setLoading(true);
//     try {
//       const endpoint = action === 'checkin' ? '/attendance/checkin' : '/attendance/checkout';
//       const res = await api.post(endpoint, {
//         latitude:     location.latitude,
//         longitude:    location.longitude,
//         faceVerified: true,
//       });
//       toast.success(res.data.message);
//       setDone({ status: action === 'checkin' ? 'E' : 'P', message: res.data.message });
//     } catch (err) {
//       const msg = err.response?.data?.message || 'Failed. Please try again.';
//       toast.error(msg);
//       if (msg.toLowerCase().includes('outside')) {
//         setLocationStatus('error');
//         setLocationMsg(msg);
//       }
//       setShowCamera(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   //  Loading screen 
//   if (loading && !todayRecord) {
//     return (
//       <div className="page" style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}>
//         <div className="spinner" />
//       </div>
//     );
//   }

//   //  Already done screen 
//   if (done) {
//     const cfg = {
//       P:  { icon:'', color:'#2e7d32', bg:'#e8f5e9', title:'Attendance Marked!' },
//       E:  { icon:'⏰', color:'#e65100', bg:'#fff3e0', title:'Checked In!' },
//       HD: { icon:'', color:'#0d47a1', bg:'#e3f2fd', title:'Half Day Recorded' },
//       A:  { icon:'', color:'#c62828', bg:'#ffebee', title:'Absent' },
//     };
//     const c = cfg[done.status] || cfg.P;
//     return (
//       <div className="page fade-in">
//         <div style={{ maxWidth:480, margin:'40px auto', textAlign:'center' }}>
//           <div style={{
//             background: c.bg, border:`2px solid ${c.color}`,
//             borderRadius:20, padding:'48px 32px',
//           }}>
//             <div style={{ fontSize:80, marginBottom:16, lineHeight:1 }}>{c.icon}</div>
//             <h2 style={{ color:c.color, marginBottom:12, fontSize:24 }}>{c.title}</h2>
//             <p style={{ color:'#555', fontSize:15, lineHeight:1.6, marginBottom:24 }}>{done.message}</p>
//             {done.status === 'E' && (
//               <div style={{
//                 background:'rgba(230,81,0,0.08)', borderRadius:10,
//                 padding:'12px 16px', marginBottom:20, fontSize:13, color:'#e65100',
//               }}>
//                  Remember to <strong>check out after 6 hours</strong> for full attendance.
//                 Missed checkout = Error (E) status.
//               </div>
//             )}
//             <button className="btn btn-primary" style={{ padding:'13px 32px', fontSize:15 }}
//               onClick={() => navigate('/student')}>
//               ← Back to Dashboard
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   //  Main mark attendance page 
//   const isCheckin  = action === 'checkin';
//   const actionColor = isCheckin ? '#2e7d32' : '#e65100';
//   const actionBg    = isCheckin ? '#e8f5e9' : '#fff3e0';

//   return (
//     <div className="page fade-in" style={{ maxWidth:600, margin:'0 auto' }}>

//       {/*  Page header  */}
//       <div style={{ marginBottom:28 }}>
//         <h1 style={{ fontSize:26, fontWeight:800, color:'var(--blue-dark)', marginBottom:6 }}>
//           {isCheckin ? '🟢 Check In' : ' Check Out'}
//         </h1>
//         <p style={{ color:'var(--gov-muted)', fontSize:14 }}>
//           {isCheckin
//             ? 'Mark your attendance for today — GPS + face required'
//             : 'End your attendance — must be 6+ hours after check-in for full day'}
//         </p>
//       </div>

//       {/*  Action badge  */}
//       <div style={{
//         background: actionBg, border:`2px solid ${actionColor}`,
//         borderRadius:10, padding:'12px 18px', marginBottom:24,
//         display:'flex', alignItems:'center', gap:12,
//       }}>
//         <div style={{ fontSize:28 }}>{isCheckin ? '🟢' : ''}</div>
//         <div>
//           <div style={{ fontWeight:700, color:actionColor, fontSize:15 }}>
//             {isCheckin ? 'Check In — First mark for today' : 'Check Out — End your attendance'}
//           </div>
//           <div style={{ fontSize:12, color:'#666', marginTop:2 }}>
//             {user.name} • {user.pinNumber} • {user.branch} {user.semester}
//           </div>
//         </div>
//       </div>

//       {/* 
//           STEP 1 — GPS Location
//        */}
//       <div style={{
//         background:'#fff', borderRadius:16, padding:'22px 24px',
//         border:'1px solid var(--gov-border)', boxShadow:'var(--shadow)',
//         marginBottom:16,
//       }}>
//         <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
//           <div style={{
//             width:36, height:36, borderRadius:'50%',
//             background: locationStatus === 'ok' ? '#2e7d32' : locationStatus === 'error' ? '#c62828' : '#1a237e',
//             color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
//             fontWeight:800, fontSize:16, flexShrink:0,
//           }}>1</div>
//           <div style={{ fontWeight:700, fontSize:16, color:'var(--blue-dark)' }}>GPS Location Check</div>
//         </div>

//         <div style={{
//           display:'flex', alignItems:'center', gap:10,
//           padding:'12px 16px', borderRadius:10, fontSize:14, fontWeight:600,
//           background:
//             locationStatus === 'ok'      ? '#e8f5e9' :
//             locationStatus === 'error'   ? '#ffebee' :
//             '#e3f2fd',
//           color:
//             locationStatus === 'ok'      ? '#2e7d32' :
//             locationStatus === 'error'   ? '#c62828' :
//             '#0d47a1',
//         }}>
//           <span style={{ fontSize:20 }}>
//             {locationStatus === 'ok'      ? '' :
//              locationStatus === 'error'   ? '' : ''}
//           </span>
//           {locationMsg}
//         </div>

//         {locationStatus === 'error' && (
//           <button className="btn btn-outline" style={{ marginTop:12, fontSize:13 }}
//             onClick={getLocation}>
//              Retry Location
//           </button>
//         )}

//         {locationStatus === 'checking' && (
//           <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:10, color:'#888', fontSize:13 }}>
//             <div className="spinner" style={{ width:16, height:16, borderWidth:2 }} />
//             Detecting GPS...
//           </div>
//         )}
//       </div>

//       {/* 
//           STEP 2 — Face Biometric
//        */}
//       <div style={{
//         background:'#fff', borderRadius:16, padding:'22px 24px',
//         border:'1px solid var(--gov-border)', boxShadow:'var(--shadow)',
//         marginBottom:24,
//       }}>
//         <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
//           <div style={{
//             width:36, height:36, borderRadius:'50%',
//             background: showCamera ? '#1a237e' : '#9e9e9e',
//             color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
//             fontWeight:800, fontSize:16, flexShrink:0,
//           }}>2</div>
//           <div style={{ fontWeight:700, fontSize:16, color:'var(--blue-dark)' }}>Face Biometric Verification</div>
//         </div>

//         {!showCamera ? (
//           <div style={{ textAlign:'center', padding:'16px 0' }}>
//             {/* Face icon placeholder */}
//             <div style={{
//               width:120, height:120, borderRadius:'50%',
//               background:'linear-gradient(135deg,#e8eaf6,#c5cae9)',
//               border:'3px dashed #9fa8da',
//               display:'flex', alignItems:'center', justifyContent:'center',
//               fontSize:52, margin:'0 auto 20px',
//             }}></div>

//             <p style={{ fontSize:14, color:'var(--gov-muted)', marginBottom:20, lineHeight:1.6 }}>
//               Your face will be scanned using your device camera.<br />
//               <strong>Look at the camera and blink twice</strong> to verify.
//             </p>

//             <button
//               className="btn btn-primary"
//               disabled={locationStatus !== 'ok'}
//               onClick={() => setShowCamera(true)}
//               style={{ padding:'14px 36px', fontSize:16, borderRadius:12 }}
//             >
//                Start Face Scan
//             </button>

//             {locationStatus !== 'ok' && (
//               <p style={{ fontSize:12, color:'#e65100', marginTop:10, fontWeight:600 }}>
//                  Complete GPS step first
//               </p>
//             )}
//           </div>
//         ) : (
//           <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
//             <FaceCamera
//               mode="verify"
//               storedDescriptor={user.faceDescriptor}
//               onVerified={handleFaceVerified}
//             />
//           </div>
//         )}

//         <div style={{
//           marginTop:16, padding:'10px 14px',
//           background:'#f5f5f5', borderRadius:8,
//           fontSize:12, color:'#888',
//           display:'flex', gap:8, alignItems:'center',
//         }}>
//            <span>Face data is processed locally. Photos and screen recordings will not work.</span>
//         </div>
//       </div>

//       {/*  Quick info  */}
//       <div style={{
//         padding:'14px 18px', borderRadius:10,
//         background:'rgba(26,35,126,0.04)', border:'1px solid rgba(26,35,126,0.1)',
//         fontSize:13, color:'var(--gov-muted)',
//         display:'grid', gridTemplateColumns:'1fr 1fr', gap:8,
//       }}>
//         <div> <strong style={{color:'var(--text)'}}>Geofence:</strong> Must be inside college</div>
//         <div>⏱ <strong style={{color:'var(--text)'}}>Full day:</strong> Check in + out, 6hr gap</div>
//         <div> <strong style={{color:'var(--text)'}}>Blinks needed:</strong> 2 blinks to verify</div>
//         <div> <strong style={{color:'var(--text)'}}>Missed checkout:</strong> Error (E) status</div>
//       </div>

//     </div>
//   );
// }


//new Third//


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import FaceCamera from '../../components/common/FaceCamera';
import './StudentPages.css';

export default function MarkAttendance() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [todayRecord,    setTodayRecord]    = useState(null);
  const [location,       setLocation]       = useState(null);
  const [locStatus,      setLocStatus]      = useState('checking'); // checking | ok | error
  const [locMsg,         setLocMsg]         = useState('Getting your location...');
  const [showCamera,     setShowCamera]     = useState(false);
  const [action,         setAction]         = useState('checkin');
  const [loading,        setLoading]        = useState(true);
  const [faceResult,     setFaceResult]     = useState(null); // null | 'success' | 'failed'
  const [done,           setDone]           = useState(null);

  useEffect(() => {
    api.get('/attendance/today')
      .then(r => {
        setTodayRecord(r.data.record);
        if (r.data.record?.status === 'E') setAction('checkout');
        if (r.data.record && r.data.record.status !== 'E') {
          setDone({ status: r.data.record.status, message: 'Attendance already marked for today.' });
        }
      })
      .finally(() => setLoading(false));
    getLocation();
    // eslint-disable-next-line
  }, []);

  const getLocation = () => {
    setLocStatus('checking');
    setLocMsg('Getting your location...');
    if (!navigator.geolocation) {
      setLocStatus('error');
      setLocMsg('Geolocation not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocStatus('ok');
        setLocMsg('Location acquired successfully');
      },
      () => {
        setLocStatus('error');
        setLocMsg('Location access denied. Please allow location and retry.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleFaceVerified = async (success) => {
    setFaceResult(success ? 'success' : 'failed');
    if (!success) return; // FaceCamera already shows red UI

    if (!location) { toast.error('Location not available.'); return; }
    setLoading(true);
    try {
      const endpoint = action === 'checkin' ? '/attendance/checkin' : '/attendance/checkout';
      const res = await api.post(endpoint, {
        latitude: location.latitude,
        longitude: location.longitude,
        faceVerified: true,
      });
      toast.success(res.data.message);
      setDone({ status: action === 'checkin' ? 'E' : 'P', message: res.data.message });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed. Please try again.';
      toast.error(msg);
      if (msg.toLowerCase().includes('outside')) {
        setLocStatus('error');
        setLocMsg(msg);
      }
      setShowCamera(false);
      setFaceResult(null);
    } finally {
      setLoading(false);
    }
  };

  /* ── Screens ── */
  if (loading && !todayRecord) {
    return (
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  /* Already done */
  if (done) {
    const isCheckout = done.status === 'P' || done.status === 'HD';
    const isCheckin  = done.status === 'E';
    const bg    = isCheckout ? '#e8f5e9' : isCheckin ? '#fff8e1' : '#f5f5f5';
    const color = isCheckout ? '#2e7d32' : isCheckin ? '#e65100' : '#555';
    const icon  = isCheckout ? '✓' : isCheckin ? '!' : 'i';
    const title = isCheckout ? 'Attendance Marked Successfully' : isCheckin ? 'Checked In' : 'Already Marked';
    return (
      <div className="dashboard">
        <div style={{ maxWidth: 500, margin: '40px auto' }}>
          <div style={{
            background: bg, border: `3px solid ${color}`,
            borderRadius: 8, padding: '48px 32px', textAlign: 'center',
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: color, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 40, fontWeight: 900, margin: '0 auto 20px',
            }}>{icon}</div>
            <h2 style={{ color, fontSize: 22, marginBottom: 10 }}>{title}</h2>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>{done.message}</p>
            {done.status === 'E' && (
              <div style={{
                background: 'rgba(230,81,0,0.08)', border: '1px solid rgba(230,81,0,0.3)',
                borderRadius: 6, padding: '12px 16px', marginBottom: 20,
                fontSize: 13, color: '#e65100', lineHeight: 1.6,
              }}>
                Remember to check out after 6 hours for full attendance.
              </div>
            )}
            <button
              className="btn btn-primary"
              style={{ padding: '12px 32px', fontSize: 14 }}
              onClick={() => navigate('/student')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCheckin = action === 'checkin';

  return (
    <div className="dashboard fade-in">
      {/* ── Page header ── */}
      <div className="page-header">
        <div>
          <div className="page-title">{isCheckin ? 'Mark Check-In' : 'Mark Check-Out'}</div>
          <div className="page-sub">
            {isCheckin
              ? 'GPS location + face biometric required to mark attendance'
              : 'Complete check-out — must be 6+ hours after check-in for full day'}
          </div>
        </div>
        <div style={{
          padding: '8px 18px', borderRadius: 4,
          background: isCheckin ? '#e6f4e6' : '#fff3e0',
          border: `1px solid ${isCheckin ? '#1a5c1a' : '#e65100'}`,
          color: isCheckin ? '#1a5c1a' : '#e65100',
          fontSize: 13, fontWeight: 700,
        }}>
          {user.name} &nbsp;|&nbsp; {user.pinNumber}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 900 }}>

        {/* ── STEP 1 — GPS ── */}
        <div className="gov-panel" style={{ borderTop: `4px solid ${locStatus === 'ok' ? '#1a5c1a' : locStatus === 'error' ? '#8d1c1c' : '#1976d2'}` }}>
          <div className="gov-panel-header" style={{ background: locStatus === 'ok' ? '#1a5c1a' : locStatus === 'error' ? '#8d1c1c' : '#1976d2' }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 13, flexShrink: 0,
            }}>1</div>
            GPS Location Check
          </div>
          <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.6 }}>
              You must be within the college boundary (200m radius) to mark attendance.
            </div>
            {/* Status indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px', borderRadius: 4,
              background: locStatus === 'ok' ? '#e6f4e6' : locStatus === 'error' ? '#fde8e8' : '#e3f0fb',
              border: `1px solid ${locStatus === 'ok' ? '#1a5c1a' : locStatus === 'error' ? '#8d1c1c' : '#1976d2'}`,
              color: locStatus === 'ok' ? '#1a5c1a' : locStatus === 'error' ? '#8d1c1c' : '#1976d2',
              fontSize: 13, fontWeight: 600,
            }}>
              {locStatus === 'checking' && <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderColor: 'rgba(25,118,210,0.3)', borderTopColor: '#1976d2' }} />}
              {locStatus === 'ok'       && <span style={{ fontSize: 16, fontWeight: 900 }}>✓</span>}
              {locStatus === 'error'    && <span style={{ fontSize: 16, fontWeight: 900 }}>✗</span>}
              {locMsg}
            </div>
            {locStatus === 'error' && (
              <button
                className="btn btn-primary"
                style={{ padding: '9px 20px', fontSize: 13 }}
                onClick={getLocation}
              >
                Retry Location
              </button>
            )}
          </div>
        </div>

        {/* ── STEP 2 — Face ── */}
        <div className="gov-panel" style={{
          borderTop: `4px solid ${
            faceResult === 'success' ? '#1a5c1a' :
            faceResult === 'failed'  ? '#8d1c1c' :
            showCamera ? '#1976d2' : '#d0d7e2'
          }`,
        }}>
          <div className="gov-panel-header" style={{
            background: faceResult === 'success' ? '#1a5c1a' : faceResult === 'failed' ? '#8d1c1c' : '#003366',
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 13, flexShrink: 0,
            }}>2</div>
            Face Biometric Verification
          </div>
          <div style={{ padding: '18px 16px' }}>
            {!showCamera ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                {/* Face icon */}
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: locStatus === 'ok' ? '#e3f0fb' : '#f0f2f5',
                  border: `2px dashed ${locStatus === 'ok' ? '#1976d2' : '#bbb'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px',
                }}>
                  <svg width="38" height="38" viewBox="0 0 24 24" fill={locStatus === 'ok' ? '#1976d2' : '#bbb'}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <p style={{ fontSize: 13, color: '#4a5568', lineHeight: 1.6, marginBottom: 16 }}>
                  Camera will scan your face.<br />
                  <strong>Blink twice</strong> to verify identity.
                </p>
                <button
                  className="btn btn-primary"
                  style={{ padding: '11px 28px', fontSize: 14, width: '100%' }}
                  disabled={locStatus !== 'ok'}
                  onClick={() => setShowCamera(true)}
                >
                  {locStatus !== 'ok' ? 'Complete GPS Step First' : 'Start Face Scan'}
                </button>
              </div>
            ) : (
              <FaceCamera
                mode="verify"
                storedDescriptor={user.faceDescriptor}
                onVerified={handleFaceVerified}
              />
            )}
          </div>
        </div>
      </div>

      {/* Info row */}
      <div style={{
        marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
        gap: 10, maxWidth: 900,
      }}>
        {[
          ['Geofence', 'Must be inside 200m of college'],
          ['Full Day',  'Check-in + check-out, 6hr gap'],
          ['Blinks',    '2 blinks required to verify face'],
          ['Missed Out','Error (E) status if not checked out'],
        ].map(([t, d]) => (
          <div key={t} style={{
            background: '#fff', border: '1px solid #d0d7e2',
            borderRadius: 4, padding: '10px 12px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#003366', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t}</div>
            <div style={{ fontSize: 12, color: '#4a5568', lineHeight: 1.5 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}