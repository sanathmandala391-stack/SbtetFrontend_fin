// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import './HomePage.css';

// /*  Data  */
// const SLIDES = [
//   {
//     cls: 's1',
//     pretitle: 'Telangana Diploma Attendance System',
//     title: <>Official Biometric<br /><span>Attendance Portal</span></>,
//     desc: 'Secure, real-time attendance management for all polytechnic colleges across Telangana — powered by face recognition and GPS geofencing.',
//     /* Replace src below with your real image path */
//     img: 'sbtet1.png',
//   },
//   {
//     cls: 's2',
//     pretitle: 'State Board of Technical Education and Training',
//     title: <>Face Biometric<br /><span>Verification System</span></>,
//     desc: 'Advanced blink-detection technology ensures only genuine students can mark attendance. No proxy, no fraud.',
//     img: 'sb3.png',
//   },
//   {
//     cls: 's3',
//     pretitle: 'GPS Geofencing Technology',
//     title: <>Location-Based<br /><span>Attendance Marking</span></>,
//     desc: 'Attendance can only be marked from within your college premises — a 200-metre GPS boundary enforced automatically.',
//     img: 'sb2.jpg',
//   },
// ];

// const NOTIFICATIONS = [
//   { date: '11-04-2026', text: 'RVCA Notification — Diploma Special Mercy Chance Supplementary Exams, DECEMBER 2025' },
//   { date: '10-04-2026', text: 'Lr to Principals for release of Special Mercy Results-DECEMBER 2025 along with the Annexure' },
//   { date: '09-04-2026', text: 'April-2026 Regular End Semester Timetable for ER-2020 I & II Year, C-21 V Semester and C-24 II & IV Semester' },
//   { date: '30-03-2026', text: 'RVCA Notification — TWSH, Jan 2026' },
//   { date: '20-03-2026', text: 'Diploma Regular Examinations April 2026 — C-21 V & VI Semesters, C-24 II & IV Semesters and ER-2020 Notification and Center List' },
//   { date: '13-03-2026', text: 'LPCET-2026 Instructions Booklet released' },
//   { date: '13-03-2026', text: 'LPCET-2026 Detailed Notification published' },
// ];

// const HIGHLIGHTS = [
//   'Diploma Regular Examinations April 2026 — Registration Open',
//   'Attendance Portal now available for all 130+ Polytechnic Colleges',
//   'Students must maintain minimum 75% attendance for examination eligibility',
//   'New: GPS Geofencing enabled for all registered colleges',
//   'HODs can now approve student registrations via the portal',
// ];

// const QUICK_ACCESS = [
//   {
//     label: 'Mark Attendance',
//     to: '/student/mark',
//     icon: <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>,
//   },
//   {
//     label: 'View Attendance',
//     to: '/student/attendance',
//     icon: <svg viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>,
//   },
//   {
//     label: 'Student Registration',
//     to: '/register',
//     icon: <svg viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
//   },
//   {
//     label: 'HOD Portal',
//     to: '/hod',
//     icon: <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z"/></svg>,
//   },
// ];

// const STATS = [
//   { label: 'Migration',      val: '1,967' },
//   { label: 'Interim',        val: '36,754' },
//   { label: 'Bonafied',       val: '11,864' },
//   { label: 'Transcript',     val: '4,184' },
//   { label: 'Duplicate Memo', val: '6,011' },
//   { label: 'Duplicate ODC',  val: '31' },
//   { label: 'Transfer',       val: '49,469' },
//   { label: 'Name Correction',val: '2,278' },
// ];

// /*  SVG icon for stats  */
// const GearIcon = () => (
//   <svg viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94zM12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>
// );

// export default function HomePage() {
//   const [current, setCurrent] = useState(0);
//   const timerRef = useRef(null);

//   const goTo = useCallback((idx) => {
//     setCurrent(((idx % SLIDES.length) + SLIDES.length) % SLIDES.length);
//   }, []);

//   const startTimer = useCallback(() => {
//     clearInterval(timerRef.current);
//     timerRef.current = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000);
//   }, []);

//   useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, [startTimer]);

//   const handleArrow = (dir) => { goTo(current + dir); startTimer(); };
//   const handleDot   = (i)   => { goTo(i);             startTimer(); };

//   return (
//     <div className="home-wrap">

//       {/* 
//           HERO IMAGE SLIDER
//        */}
//       <div className="hero-slider">
//         <div
//           className="slide-track"
//           style={{ transform: `translateX(-${current * 100}%)` }}
//         >
//           {SLIDES.map((s, i) => (
//             <div key={i} className={`hero-slide ${s.cls}`}>
//               {/* Placeholder image — replace img src with real path */}
//               <div className="slide-img-placeholder">
//                 <img
//                   src={s.img}
//                   alt={`Slide ${i + 1}`}
//                   onError={e => { e.target.style.display = 'none'; }}
//                 />
//                 {/* Blank placeholder shown when image not found */}
//                 <div className="placeholder-box">
//                   <svg viewBox="0 0 24 24" fill="currentColor">
//                     <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
//                   </svg>
//                   <span>Add image: {s.img}</span>
//                 </div>
//               </div>

//               <div className="slide-overlay" />

//               <div className="slide-content">
//                 <div className="slide-pretitle">{s.pretitle}</div>
//                 <h1 className="slide-title">{s.title}</h1>
//                 <p className="slide-desc">{s.desc}</p>
//                 <div className="slide-actions">
//                   <Link to="/login"    className="btn btn-accent btn-lg">Login to Portal</Link>
//                   <Link to="/register" className="btn btn-outline-white btn-lg">Register</Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Arrows */}
//         <button className="slider-arrow prev" onClick={() => handleArrow(-1)}>&#8249;</button>
//         <button className="slider-arrow next" onClick={() => handleArrow(1)}>&#8250;</button>

//         {/* Dots */}
//         <div className="slider-dots">
//           {SLIDES.map((_, i) => (
//             <button key={i} className={`s-dot ${current === i ? 'active' : ''}`} onClick={() => handleDot(i)} />
//           ))}
//         </div>

//         {/* Counter */}
//         <div className="slide-counter">{current + 1} / {SLIDES.length}</div>
//       </div>

//       {/* 
//           HIGHLIGHTS MARQUEE
//        */}
//       <div style={{ padding: '10px 28px', background: '#fff', borderBottom: '1px solid #d0d7e2' }}>
//         <div className="highlights-bar">
//           <span className="hl-label">Latest</span>
//           <div className="hl-marquee">
//             <div className="hl-inner">
//               {[...HIGHLIGHTS, ...HIGHLIGHTS].map((h, i) => (
//                 <span key={i} className="hl-item">{h} &nbsp;&nbsp; | &nbsp;&nbsp;</span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 
//           QUICK ACCESS ROW
//        */}
//       <div style={{ padding: '16px 28px', background: '#f0f2f5' }}>
//         <div className="quick-access card">
//           {QUICK_ACCESS.map((q, i) => (
//             <Link key={i} to={q.to} className="qa-item">
//               <div className="qa-icon">{q.icon}</div>
//               <div className="qa-label">{q.label}</div>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* 
//           MAIN 2-COLUMN CONTENT
//        */}
//       <div className="home-main">

//         {/* Left: About + Announcements */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

//           {/* About section */}
//           <div className="card" style={{ overflow: 'hidden' }}>
//             <div className="section-bar">About SBTET Attendance Portal</div>
//             <div style={{ padding: '20px 22px' }}>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
//                 <div>
//                   <h3 style={{ fontSize: 15, marginBottom: 10, color: '#003580' }}>
//                     Diploma Attendance Management
//                   </h3>
//                   <p style={{ fontSize: 13, color: '#555', lineHeight: 1.75, marginBottom: 12 }}>
//                     The <strong>State Board of Technical Education and Training (SBTET), Telangana</strong> governs technical education across the state, overseeing more than <strong>130 polytechnic colleges</strong> offering diploma programmes in engineering and technology.
//                   </p>
//                   <p style={{ fontSize: 13, color: '#555', lineHeight: 1.75 }}>
//                     Students must maintain a minimum <strong style={{ color: '#003580' }}>75% attendance</strong> to be eligible for semester examinations. This portal automates tracking with face biometrics and GPS geofencing.
//                   </p>
//                 </div>
//                 <div>
//                   <h3 style={{ fontSize: 14, marginBottom: 10, color: '#003580' }}>Key Features</h3>
//                   {[
//                     ['Face Biometric Verification', 'Blink-detection prevents photo spoofing'],
//                     ['GPS Geofencing',              '200m college boundary enforced automatically'],
//                     ['Real-time Tracking',          'Live attendance status for HODs and Faculty'],
//                     ['SBTET-Style Reports',         'Monthly calendar view — P, A, HP, W, H'],
//                     ['Multi-Role Access',           'Students, Faculty, HOD and Admin portals'],
//                   ].map(([t, d]) => (
//                     <div key={t} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
//                       <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a7a3c" style={{ flexShrink: 0, marginTop: 2 }}>
//                         <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
//                       </svg>
//                       <div>
//                         <div style={{ fontSize: 13, fontWeight: 700, color: '#1c1c2e' }}>{t}</div>
//                         <div style={{ fontSize: 12, color: '#666' }}>{d}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Process steps */}
//           <div className="card" style={{ overflow: 'hidden' }}>
//             <div className="section-bar">How Attendance Works</div>
//             <div style={{ padding: '20px 22px' }}>
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
//                 {[
//                   { n:'01', t:'Arrive at College', d:'GPS confirms you are within the 200m college boundary before attendance unlocks.' },
//                   { n:'02', t:'Face & Blink Verify', d:'Look at the camera and blink twice. Your face is matched against the registered photo.' },
//                   { n:'03', t:'Check Out After 6h', d:'Check out for full-day attendance. Under 6 hours records as Half Day. Missed = Error.' },
//                 ].map((s, i) => (
//                   <div key={i} style={{ textAlign: 'center', padding: '20px 14px', border: '1px solid #d0d7e2', borderRadius: 4 }}>
//                     <div style={{
//                       width: 48, height: 48, borderRadius: '50%',
//                       background: 'linear-gradient(135deg, #003580, #0057b8)', color: '#fff',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       fontWeight: 800, fontSize: 16, margin: '0 auto 14px',
//                     }}>{s.n}</div>
//                     <div style={{ fontSize: 14, fontWeight: 700, color: '#003580', marginBottom: 8 }}>{s.t}</div>
//                     <div style={{ fontSize: 12.5, color: '#666', lineHeight: 1.65 }}>{s.d}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//         </div>

//         {/* Right: Notifications + Login */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

//           {/* Notifications */}
//           <div className="notif-card">
//             <div className="notif-header">
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
//               </svg>
//               Notifications
//             </div>
//             <ul className="notif-list">
//               {NOTIFICATIONS.map((n, i) => (
//                 <li key={i} className="notif-item">
//                   <div className="notif-bullet" />
//                   <div className="notif-body">
//                     <span className="notif-date">{n.date}</span>
//                     <span className="notif-text">{n.text}</span>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//             <div className="notif-footer">
//               <button className="view-all-btn">View All</button>
//             </div>
//           </div>

//           {/* Login panel */}
//           <div className="home-login-panel">
//             <div className="hlp-header">
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
//               </svg>
//               Portal Access
//             </div>
//             <div className="hlp-body">
//               <h3>Login to Your Account</h3>
//               <p>Access your role-based dashboard — Student, Faculty, HOD, or Admin — to manage attendance records.</p>
//               <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//                 <Link to="/login"    className="btn btn-primary" style={{ justifyContent: 'center', padding: '10px' }}>Login to Portal</Link>
//                 <Link to="/register" className="btn btn-outline" style={{ justifyContent: 'center', padding: '10px' }}>New Registration</Link>
//               </div>
//               <div style={{ marginTop: 14, padding: '10px 12px', background: '#f0f2f5', borderRadius: 3, fontSize: 11.5, color: '#555', lineHeight: 1.6 }}>
//                 For support: 08031404549 &nbsp;|&nbsp; sbtet-helpdesk@telangana.gov.in<br />
//                 Working Days: 10:30AM to 05:00PM
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* 
//           STATISTICS STRIP
//        */}
//       <div style={{ padding: '0 28px 22px', background: '#f0f2f5' }}>
//         <div className="stats-strip">
//           <div className="stats-strip-header">
//             Current Academic Year — Student Services Statistics
//           </div>
//           <div className="stats-strip-grid">
//             {STATS.map((s, i) => (
//               <div key={i} className="stat-col-item">
//                 <div className="sci-label">{s.label}</div>
//                 <div className="sci-icon"><GearIcon /></div>
//                 <div className="sci-value">{s.val}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* 
//           FOOTER
//        */}
//       <footer className="gov-footer">
//         <div className="gov-footer-inner">
//           <div>
//             <h4>SBTET Telangana</h4>
//             <p>
//               State Board of Technical Education and Training<br />
//               Government of Telangana<br />
//               Hyderabad — 500 028
//             </p>
//             <div className="social-row" style={{ marginTop: 14, justifyContent: 'flex-start' }}>
//               <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn fb">f</a>
//               <a href="https://twitter.com"  target="_blank" rel="noreferrer" className="social-btn tw">t</a>
//               <a href="https://youtube.com"  target="_blank" rel="noreferrer" className="social-btn yt">y</a>
//             </div>
//           </div>
//           <div>
//             <h4>Quick Links</h4>
//             <ul>
//               <li><Link to="/">Home</Link></li>
//               <li><Link to="/login">Login</Link></li>
//               <li><Link to="/register">Register</Link></li>
//               <li><a href="https://sbtet.telangana.gov.in" target="_blank" rel="noreferrer">SBTET Official Site</a></li>
//             </ul>
//           </div>
//           <div>
//             <h4>Services</h4>
//             <ul>
//               <li><a href="#!">Student Attendance</a></li>
//               <li><a href="#!">Faculty Reports</a></li>
//               <li><a href="#!">HOD Approvals</a></li>
//               <li><a href="#!">College Registration</a></li>
//             </ul>
//           </div>
//           <div>
//             <h4>Contact</h4>
//             <ul>
//               <li><a href="tel:08031404549">08031404549</a></li>
//               <li><a href="mailto:sbtet-helpdesk@telangana.gov.in">sbtet-helpdesk@telangana.gov.in</a></li>
//               <li style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>All Working Days<br />10:30 AM – 05:00 PM</li>
//             </ul>
//           </div>
//         </div>
//         <div className="gov-footer-bottom">
//           &copy; 2026 State Board of Technical Education and Training, Telangana — All rights reserved.
//         </div>
//       </footer>

//     </div>
//   );
// }




import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

import './HomePage.css';




/*  Data  */
const SLIDES = [
  {
    cls: 's1',
    pretitle: 'Telangana Diploma Attendance System',
    title: <>Official Biometric<br /><span>Attendance Portal</span></>,
    desc: 'Secure, real-time attendance management for all polytechnic colleges across Telangana — powered by face recognition and GPS geofencing.',
    img: '/sbtet1.png',
  },
  {
    cls: 's2',
    pretitle: 'State Board of Technical Education and Training',
    title: <>Face Biometric<br /><span>Verification System</span></>,
    desc: 'Advanced blink-detection technology ensures only genuine students can mark attendance. No proxy, no fraud.',
    img: '/sb3.png',
  },
  {
    cls: 's3',
    pretitle: 'GPS Geofencing Technology',
    title: <>Location-Based<br /><span>Attendance Marking</span></>,
    desc: 'Attendance can only be marked from within your college premises — a 200-metre GPS boundary enforced automatically.',
    img: '/sb2.jpg',
  },
];

const NOTIFICATIONS = [
  { date: '11-04-2026', text: 'RVCA Notification — Diploma Special Mercy Chance Supplementary Exams, DECEMBER 2025' },
  { date: '10-04-2026', text: 'Lr to Principals for release of Special Mercy Results-DECEMBER 2025 along with the Annexure' },
  { date: '09-04-2026', text: 'April-2026 Regular End Semester Timetable for ER-2020 I & II Year, C-21 V Semester and C-24 II & IV Semester' },
  { date: '30-03-2026', text: 'RVCA Notification — TWSH, Jan 2026' },
  { date: '20-03-2026', text: 'Diploma Regular Examinations April 2026 — C-21 V & VI Semesters, C-24 II & IV Semesters and ER-2020 Notification and Center List' },
  { date: '13-03-2026', text: 'LPCET-2026 Instructions Booklet released' },
  { date: '13-03-2026', text: 'LPCET-2026 Detailed Notification published' },
];

const HIGHLIGHTS = [
  'Diploma Regular Examinations April 2026 — Registration Open',
  'Attendance Portal now available for all 130+ Polytechnic Colleges',
  'Students must maintain minimum 75% attendance for examination eligibility',
  'New: GPS Geofencing enabled for all registered colleges',
  'HODs can now approve student registrations via the portal',
];

const QUICK_ACCESS = [
  {
    label: 'Mark Attendance',
    to: '/student/mark',
    icon: <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>,
  },
  {
    label: 'View Attendance',
    to: '/student/attendance',
    icon: <svg viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>,
  },
  {
    label: 'Student Registration',
    to: '/register',
    icon: <svg viewBox="0 0 24 24"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
  },
  {
    label: 'HOD Portal',
    to: '/hod',
    icon: <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z"/></svg>,
  },
];

const STATS = [
  { label: 'Migration',      val: '1,967' },
  { label: 'Interim',        val: '36,754' },
  { label: 'Bonafied',       val: '11,864' },
  { label: 'Transcript',     val: '4,184' },
  { label: 'Duplicate Memo', val: '6,011' },
  { label: 'Duplicate ODC',  val: '31' },
  { label: 'Transfer',       val: '49,469' },
  { label: 'Name Correction',val: '2,278' },
];

const GearIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94zM12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>
);

export default function HomePage() {

useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false);
  }, 5000);

  return () => clearTimeout(timer);
}, []);


  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const goTo = useCallback((idx) => {
    setCurrent(((idx % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 3000);
  }, []);

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current); }, [startTimer]);

  const handleArrow = (dir) => { goTo(current + dir); startTimer(); };
  const handleDot   = (i)   => { goTo(i);             startTimer(); };


  return (
    <div className="home-wrap">
      

      {/* HERO IMAGE SLIDER */}
      <div className="hero-slider">
        <div
          className="slide-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDES.map((s, i) => (
            <div key={i} className={`hero-slide ${s.cls}`}>
              <div className="slide-bg">
                <img
                  src={s.img}
                  alt={`Slide ${i + 1}`}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="slide-overlay" />
              <div className="slide-content">
                <div className="slide-pretitle">{s.pretitle}</div>
                <h1 className="slide-title">{s.title}</h1>
                <p className="slide-desc">{s.desc}</p>
                <div className="slide-actions">
                  <Link to="/login"    className="btn btn-accent btn-lg">Login to Portal</Link>
                  <Link to="/register" className="btn btn-outline-white btn-lg">Register</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button className="slider-arrow prev" onClick={() => handleArrow(-1)}>&#8249;</button>
        <button className="slider-arrow next" onClick={() => handleArrow(1)}>&#8250;</button>

        {/* Dots */}
        <div className="slider-dots">
          {SLIDES.map((_, i) => (
            <button key={i} className={`s-dot ${current === i ? 'active' : ''}`} onClick={() => handleDot(i)} />
          ))}
        </div>

        {/* Counter */}
        <div className="slide-counter">{current + 1} / {SLIDES.length}</div>
      </div>

      {/* HIGHLIGHTS MARQUEE */}
      <div className="highlights-wrap">
        <div className="highlights-bar">
          <span className="hl-label">Latest</span>
          <div className="hl-marquee">
            <div className="hl-inner">
              {[...HIGHLIGHTS, ...HIGHLIGHTS].map((h, i) => (
                <span key={i} className="hl-item">{h} &nbsp;&nbsp; | &nbsp;&nbsp;</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACCESS ROW */}
      <div className="qa-wrap">
        <div className="quick-access card">
          {QUICK_ACCESS.map((q, i) => (
            <Link key={i} to={q.to} className="qa-item">
              <div className="qa-icon">{q.icon}</div>
              <div className="qa-label">{q.label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* MAIN 2-COLUMN CONTENT */}
      <div className="home-main">

        {/* Left: About + How it works */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* About section */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="section-bar">About SBTET Attendance Portal</div>
            <div style={{ padding: '20px 22px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <h3 style={{ fontSize: 15, marginBottom: 10, color: '#003580' }}>
                    Diploma Attendance Management
                  </h3>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.75, marginBottom: 12 }}>
                    The <strong>State Board of Technical Education and Training (SBTET), Telangana</strong> governs technical education across the state, overseeing more than <strong>130 polytechnic colleges</strong> offering diploma programmes in engineering and technology.
                  </p>
                  <p style={{ fontSize: 13, color: '#555', lineHeight: 1.75 }}>
                    Students must maintain a minimum <strong style={{ color: '#003580' }}>75% attendance</strong> to be eligible for semester examinations. This portal automates tracking with face biometrics and GPS geofencing.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: 14, marginBottom: 10, color: '#003580' }}>Key Features</h3>
                  {[
                    ['Face Biometric Verification', 'Blink-detection prevents photo spoofing'],
                    ['GPS Geofencing',              '200m college boundary enforced automatically'],
                    ['Real-time Tracking',          'Live attendance status for HODs and Faculty'],
                    ['SBTET-Style Reports',         'Monthly calendar view — P, A, HP, W, H'],
                    ['Multi-Role Access',           'Students, Faculty, HOD and Admin portals'],
                  ].map(([t, d]) => (
                    <div key={t} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a7a3c" style={{ flexShrink: 0, marginTop: 2 }}>
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1c1c2e' }}>{t}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Process steps */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="section-bar">How Attendance Works</div>
            <div style={{ padding: '20px 22px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                {[
                  { n:'01', t:'Arrive at College',    d:'GPS confirms you are within the 200m college boundary before attendance unlocks.' },
                  { n:'02', t:'Face & Blink Verify',  d:'Look at the camera and blink twice. Your face is matched against the registered photo.' },
                  { n:'03', t:'Check Out After 6h',   d:'Check out for full-day attendance. Under 6 hours records as Half Day. Missed = Error.' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '20px 14px', border: '1px solid #d0d7e2', borderRadius: 4 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #003580, #0057b8)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 16, margin: '0 auto 14px',
                    }}>{s.n}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#003580', marginBottom: 8 }}>{s.t}</div>
                    <div style={{ fontSize: 12.5, color: '#666', lineHeight: 1.65 }}>{s.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Right: Notifications + Login */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Notifications */}
          <div className="notif-card">
            <div className="notif-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
              Notifications
            </div>
            <ul className="notif-list">
              {NOTIFICATIONS.map((n, i) => (
                <li key={i} className="notif-item">
                  <div className="notif-bullet" />
                  <div className="notif-body">
                    <span className="notif-date">{n.date}</span>
                    <span className="notif-text">{n.text}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="notif-footer">
              <button className="view-all-btn">View All</button>
            </div>
          </div>

          {/* Login panel */}
          <div className="home-login-panel">
            <div className="hlp-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Portal Access
            </div>
            <div className="hlp-body">
              <h3>Login to Your Account</h3>
              <p>Access your role-based dashboard — Student, Faculty, HOD, or Admin — to manage attendance records.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/login"    className="btn btn-primary" style={{ justifyContent: 'center', padding: '10px' }}>Login to Portal</Link>
                <Link to="/register" className="btn btn-outline" style={{ justifyContent: 'center', padding: '10px' }}>New Registration</Link>
              </div>
              <div style={{ marginTop: 14, padding: '10px 12px', background: '#f0f2f5', borderRadius: 3, fontSize: 11.5, color: '#555', lineHeight: 1.6 }}>
                For support: 08031404549 &nbsp;|&nbsp; sbtet-helpdesk@telangana.gov.in<br />
                Working Days: 10:30AM to 05:00PM
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* STATISTICS STRIP */}
      <div className="stats-wrap">
        <div className="stats-strip">
          <div className="stats-strip-header">
            Current Academic Year — Student Services Statistics
          </div>
          <div className="stats-strip-grid">
            {STATS.map((s, i) => (
              <div key={i} className="stat-col-item">
                <div className="sci-label">{s.label}</div>
                <div className="sci-icon"><GearIcon /></div>
                <div className="sci-value">{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="gov-footer">
        <div className="gov-footer-inner">
          <div>
            <h4>SBTET Telangana</h4>
            <p>
              State Board of Technical Education and Training<br />
              Government of Telangana<br />
              Hyderabad — 500 028
            </p>
            <div className="social-row" style={{ marginTop: 14, justifyContent: 'flex-start' }}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn fb">f</a>
              <a href="https://twitter.com"  target="_blank" rel="noreferrer" className="social-btn tw">t</a>
              <a href="https://youtube.com"  target="_blank" rel="noreferrer" className="social-btn yt">y</a>
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><a href="https://sbtet.telangana.gov.in" target="_blank" rel="noreferrer">SBTET Official Site</a></li>
            </ul>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              <li><a href="#!">Student Attendance</a></li>
              <li><a href="#!">Faculty Reports</a></li>
              <li><a href="#!">HOD Approvals</a></li>
              <li><a href="#!">College Registration</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:08031404549">08031404549</a></li>
              <li><a href="mailto:sbtet-helpdesk@telangana.gov.in">sbtet-helpdesk@telangana.gov.in</a></li>
              <li style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>All Working Days<br />10:30 AM – 05:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="gov-footer-bottom">
          &copy; 2026 State Board of Technical Education and Training, Telangana — All rights reserved.
        </div>
      </footer>

    </div>
  );
}
