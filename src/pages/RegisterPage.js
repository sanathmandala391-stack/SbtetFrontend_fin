// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import api from '../utils/api';
// import FaceCamera from '../components/common/FaceCamera';
// import './AuthPages.css';

// const STEPS = ['Role & College', 'Personal Info', 'Face Registration', 'Done'];

// const BRANCHES = [
//   'AA - ARCHITECTURAL ASSISTANTSHIP',
//   'AI - ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING',
//   'AU - AUTOMOBILE ENGINEERING',
//   'BM - BIOMEDICAL ENGINEERING',
//   'CCB - CLOUD COMPUTING AND BIG DATA',
//   'CCP - COMMERCIAL AND COMPUTER PRACTICE',
//   'CE - CIVIL ENGINEERING',
//   'CH - CHEMICAL ENGINEERING',
//   'CPS - CYBER PHYSICAL SYSTEMS AND SECURITY',
//   'CS - COMPUTER SCIENCE AND ENGINEERING',
//   'EC - ELECTRONICS & COMMUNICATION ENGINEERING',
//   'EE - ELECTRICAL AND ELECTRONICS ENGINEERING',
//   'EEV - ELECTRICAL ENGINEERING AND ELECTRIC VEHICLE TECHNOLOGY',
//   'EI - ELECTRONICS AND INSTRUMENTATION ENGINEERING',
//   'ES - EMBEDDED SYSTEMS',
//   'EV - ELECTRONICS AND VIDEO ENGINEERING',
//   'HS - HOME SCIENCE',
//   'LF - LEATHER AND FASHION TECHNOLOGY',
//   'LG - LEATHER GOODS & FOOTWEAR TECHNOLOGY',
//   'ME - MECHANICAL ENGINEERING',
//   'MN - MINING ENGINEERING',
//   'MT - METALLURGICAL ENGINEERING',
//   'PH - PHARMACY',
//   'PK - PACKAGING TECHNOLOGY',
//   'PT - PRINTING TECHNOLOGY',
//   'TT - TEXTILE TECHNOLOGY'
// ];
// const SEMESTERS = ['1SEM','2SEM','3SEM','4SEM','5SEM','6SEM'];

// export default function RegisterPage() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(0);
//   const [role, setRole] = useState('student');
//   const [colleges, setColleges] = useState([]);
//   const [collegeVerified, setCollegeVerified] = useState(null);
//   const [faceData, setFaceData] = useState({ base64: null, descriptor: null });
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState({
//     name: '', email: '', password: '', confirm: '',
//     pinNumber: '', branch: '', semester: '',
//     collegeCode: '', department: '', subjects: ''
//   });

//   useEffect(() => {
//     api.get('/college').then(r => setColleges(r.data)).catch(() => {});
//   }, []);

//   const verifyCollege = async () => {
//     if (!form.collegeCode) return toast.error('Enter college code');
//     try {
//       const r = await api.get(`/college/${form.collegeCode}`);
//       setCollegeVerified(r.data);
//       toast.success(`College found: ${r.data.collegeName}`);
//     } catch {
//       toast.error('College code not found. Only registered colleges can add users.');
//       setCollegeVerified(null);
//     }
//   };

//   const nextStep = () => {
//     if (step === 0 && !collegeVerified) return toast.error('Please verify your college code first.');
//     if (step === 0 && role === 'student' && !form.pinNumber) return toast.error('Enter your PIN number.');
//     if (step === 1) {
//       if (!form.name || !form.email || !form.password) return toast.error('Fill all required fields.');
//       if (form.password !== form.confirm) return toast.error('Passwords do not match.');
//       if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
//     }
//     setStep(s => s + 1);
//   };

//   const handleFaceCapture = (base64, descriptor) => {
//     setFaceData({ base64, descriptor });
//     toast.success('Face captured successfully!');
//     setStep(3);
//     handleSubmit(base64, descriptor);
//   };

//   const handleSubmit = async (base64, descriptor) => {
//     setLoading(true);
//     try {
//       const payload = {
//         name: form.name, email: form.email, password: form.password,
//         collegeCode: form.collegeCode.toUpperCase(),
//         faceImageBase64: base64,
//         faceDescriptor: descriptor ? JSON.stringify(Array.from(descriptor)) : "[]"
//       };
//       if (role === 'student') {
//         Object.assign(payload, { pinNumber: form.pinNumber, branch: form.branch, semester: form.semester });
//         await api.post('/auth/register/student', payload);
//       } else {
//         Object.assign(payload, { department: form.department, subjects: JSON.stringify(form.subjects.split(',').map(s=>s.trim()).filter(s=>s)), role: role.toUpperCase() });
//         await api.post('/auth/register/faculty', payload);
//       }
//       toast.success('Registration successful! Awaiting approval.');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Registration failed.');
//       setStep(2);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-left">
//         <div className="auth-left-content">
//           <div className="auth-logo">T</div>
//           <h1>SBTET Telangana</h1>
//           <p>Create Your Account</p>
//           <div className="auth-steps-sidebar">
//             {STEPS.map((s, i) => (
//               <div key={i} className={`sidebar-step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
//                 <div className="sidebar-step-num">{i < step ? '' : i + 1}</div>
//                 <span>{s}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="auth-right">
//         <div className="auth-box fade-in" style={{maxWidth: step === 2 ? 560 : 440}}>
//           <h2>{STEPS[step]}</h2>
//           <p className="auth-sub">
//             {step===0 && 'Select your role and verify your college'}
//             {step===1 && 'Enter your personal information'}
//             {step===2 && 'Look at the camera and blink twice to register your face'}
//             {step===3 && (loading ? 'Submitting your registration...' : ' Registration Complete!')}
//           </p>

//           {/* Step 0: Role & College */}
//           {step === 0 && (
//             <div className="auth-form">
//               <div className="form-group">
//                 <label className="form-label">I am a</label>
//                 <div className="role-selector">
//                   {['student','faculty','hod'].map(r => (
//                     <button key={r} type="button"
//                       className={`role-btn ${role === r ? 'active' : ''}`}
//                       onClick={() => setRole(r)}>
//                       {r === 'student' ? '' : r === 'faculty' ? '‍' : ''} {r.toUpperCase()}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label className="form-label">College Code</label>
//                 <div style={{display:'flex',gap:8}}>
//                   <input className="form-input" placeholder="e.g. 047" value={form.collegeCode}
//                     onChange={e => { setForm({...form, collegeCode: e.target.value}); setCollegeVerified(null); }} />
//                   <button type="button" className="btn btn-primary" style={{flexShrink:0,padding:'10px 16px',fontSize:13}} onClick={verifyCollege}>Verify</button>
//                 </div>
//                 {collegeVerified && <div style={{marginTop:8,padding:'10px 14px',background:'#e8f5e9',borderRadius:8,fontSize:13,color:'#2e7d32',fontWeight:600}}> {collegeVerified.collegeName || collegeVerified.name} — {collegeVerified.district}</div>}
//               </div>
//               {role === 'student' && (
//                 <>
//                   <div className="form-group">
//                     <label className="form-label">PIN Number</label>
//                     <input className="form-input" placeholder="e.g. 24047-CS-023" value={form.pinNumber}
//                       onChange={e => setForm({...form, pinNumber: e.target.value})} />
//                   </div>
//                   <div className="form-group">
//                     <label className="form-label">Branch</label>



//                     {/* <select className="form-input" value={form.branch} onChange={e => setForm({...form, branch: e.target.value})}>
//                       <option value="">Select Branch</option>
//                       {(collegeVerified?.branches?.length ? collegeVerified.branches : BRANCHES.map(b=>({code:b,name:b}))).map(b => (
//                         <option key={b.code} value={b.code}>{b.code} — {b.name || b.code}</option>
//                       ))}
//                     </select> */}

//                     <select className="form-input" value={form.branch} onChange={e => setForm({...form, branch: e.target.value})}>
//   <option value="">Select Branch</option>
//   {(collegeVerified?.branches?.length ? collegeVerified.branches : []).map(b => (
//     <option key={b.code} value={b.code}>
//       {b.code} — {b.name || b.code}
//     </option>
//   ))}
// </select>


//                   </div>
//                   <div className="form-group">
//                     <label className="form-label">Semester</label>
//                     <select className="form-input" value={form.semester} onChange={e => setForm({...form, semester: e.target.value})}>
//                       <option value="">Select Semester</option>
//                       {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
//                     </select>
//                   </div>
//                 </>
//               )}
//               {(role === 'faculty' || role === 'hod') && (
//                 <>
//                   <div className="form-group">
//                     <label className="form-label">Department</label>
//                     <input className="form-input" placeholder="e.g. Computer Science" value={form.department}
//                       onChange={e => setForm({...form, department: e.target.value})} />
//                   </div>
//                   <div className="form-group">
//                     <label className="form-label">Subjects (comma separated)</label>
//                     <input className="form-input" placeholder="e.g. DBMS, OS, Networks" value={form.subjects}
//                       onChange={e => setForm({...form, subjects: e.target.value})} />
//                   </div>
//                 </>
//               )}
//               <button className="btn btn-primary" style={{width:'100%',padding:'14px'}} onClick={nextStep}>Next →</button>
//             </div>
//           )}

//           {/* Step 1: Personal Info */}
//           {step === 1 && (
//             <div className="auth-form">
//               <div className="form-group">
//                 <label className="form-label">Full Name</label>
//                 <input className="form-input" placeholder="Your full name" value={form.name}
//                   onChange={e => setForm({...form, name: e.target.value})} />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Email Address</label>
//                 <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
//                   onChange={e => setForm({...form, email: e.target.value})} />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Password</label>
//                 <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password}
//                   onChange={e => setForm({...form, password: e.target.value})} />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Confirm Password</label>
//                 <input className="form-input" type="password" placeholder="Repeat password" value={form.confirm}
//                   onChange={e => setForm({...form, confirm: e.target.value})} />
//               </div>
//               <div style={{display:'flex',gap:12}}>
//                 <button className="btn btn-outline" style={{flex:1,padding:'14px'}} onClick={() => setStep(0)}>← Back</button>
//                 <button className="btn btn-primary" style={{flex:2,padding:'14px'}} onClick={nextStep}>Next →</button>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Face */}
//           {step === 2 && (
//             <div>
//               <FaceCamera mode="register" onCapture={handleFaceCapture} />
//               <button className="btn btn-outline" style={{width:'100%',marginTop:16,padding:'12px'}} onClick={() => setStep(1)}>← Back</button>
//             </div>
//           )}

//           {/* Step 3: Done */}
//           {step === 3 && (
//             <div className="done-state">
//               {loading ? (
//                 <><div className="spinner" style={{margin:'0 auto'}} /><p>Submitting...</p></>
//               ) : (
//                 <>
//                   <div className="done-icon"></div>
//                   <h3>Registration Submitted!</h3>
//                   <p>Your account is pending approval from your {role === 'student' ? 'HOD' : 'Admin'}. You will be able to login once approved.</p>
//                   <Link to="/login" className="btn btn-primary" style={{width:'100%',padding:'14px',marginTop:20}}>Go to Login →</Link>
//                 </>
//               )}
//             </div>
//           )}

//           {step < 2 && <p className="auth-switch">Already registered? <Link to="/login">Login here</Link></p>}
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import FaceCamera from '../components/common/FaceCamera';
import './AuthPages.css';

const STEPS = ['Role & College', 'Personal Info', 'Face Registration', 'Done'];

const SEMESTERS = ['1SEM','2SEM','3SEM','4SEM','5SEM','6SEM'];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step,             setStep]             = useState(0);
  const [role,             setRole]             = useState('student');
  const [collegeVerified,  setCollegeVerified]  = useState(null);
  const [loading,          setLoading]          = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '',
    pinNumber: '', branch: '', semester: '',
    collegeCode: '', department: '', subjects: ''
  });

  useEffect(() => {
    api.get('/college').catch(() => {});
  }, []);

  const verifyCollege = async () => {
    if (!form.collegeCode) return toast.error('Enter college code');
    try {
      const r = await api.get(`/college/${form.collegeCode}`);
      setCollegeVerified(r.data);
      toast.success(`College found: ${r.data.collegeName || r.data.name}`);
    } catch {
      toast.error('College code not found.');
      setCollegeVerified(null);
    }
  };

  const nextStep = () => {
    if (step === 0 && !collegeVerified) return toast.error('Please verify your college code first.');
    if (step === 0 && role === 'student' && !form.pinNumber) return toast.error('Enter your PIN number.');
    if (step === 1) {
      if (!form.name || !form.email || !form.password) return toast.error('Fill all required fields.');
      if (form.password !== form.confirm) return toast.error('Passwords do not match.');
      if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    }
    setStep(s => s + 1);
  };

  const handleFaceCapture = (base64, descriptor) => {
    setStep(3);
    handleSubmit(base64, descriptor);
  };

  const handleSubmit = async (base64, descriptor) => {
    setLoading(true);
    try {
      const payload = {
        name: form.name, email: form.email, password: form.password,
        collegeCode: form.collegeCode.toUpperCase(),
        faceImageBase64: base64,
        faceDescriptor: descriptor ? JSON.stringify(Array.from(descriptor)) : '[]',
      };
      if (role === 'student') {
        Object.assign(payload, { pinNumber: form.pinNumber, branch: form.branch, semester: form.semester });
        await api.post('/auth/register/student', payload);
      } else {
        Object.assign(payload, {
          department: form.department,
          subjects: JSON.stringify(form.subjects.split(',').map(s => s.trim()).filter(Boolean)),
          role: role.toUpperCase(),
        });
        await api.post('/auth/register/faculty', payload);
      }
      toast.success('Registration submitted! Awaiting approval.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ── LEFT SIDEBAR ── */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">T</div>
          <h1>SBTET Telangana<br />New Registration</h1>
          <p>State Board of Technical Education and Training, Telangana — Create your official portal account</p>

          {/* Step progress */}
          <div className="auth-steps-sidebar">
            {STEPS.map((s, i) => (
              <div key={i} className={`sidebar-step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                <div className="sidebar-step-num">{i < step ? '✓' : i + 1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>

          {/* Info bullets */}
          <div className="auth-features" style={{ marginTop: 8 }}>
            <div className="auth-feat">Face biometric captured during registration</div>
            <div className="auth-feat">HOD / Admin approval required before login</div>
            <div className="auth-feat">GPS + face required for each attendance</div>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM ── */}
      <div className="auth-right">
        <div className="auth-box fade-in" style={{ maxWidth: step === 2 ? 540 : 460 }}>
          <h2>{STEPS[step]}</h2>
          <p className="auth-sub">
            {step === 0 && 'Select your role and verify your college code'}
            {step === 1 && 'Enter your personal details and set a password'}
            {step === 2 && 'Position your face in the frame and blink twice to register'}
            {step === 3 && (loading ? 'Submitting your registration, please wait...' : 'Registration Complete')}
          </p>

          {/* ── Step 0: Role & College ── */}
          {step === 0 && (
            <div className="auth-form">
              <div className="form-group">
                <label className="form-label">I am a</label>
                <div className="role-selector">
                  {['student', 'faculty', 'hod'].map(r => (
                    <button
                      key={r} type="button"
                      className={`role-btn ${role === r ? 'active' : ''}`}
                      onClick={() => setRole(r)}
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">College Code</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="form-input" placeholder="e.g. 047"
                    value={form.collegeCode}
                    onChange={e => { setForm({ ...form, collegeCode: e.target.value }); setCollegeVerified(null); }}
                  />
                  <button
                    type="button" className="btn btn-primary"
                    style={{ flexShrink: 0, padding: '10px 16px', fontSize: 13 }}
                    onClick={verifyCollege}
                  >
                    Verify
                  </button>
                </div>
                {collegeVerified && (
                  <div className="college-verified-box">
                    <span style={{ fontWeight: 900, fontSize: 16 }}>✓</span>
                    {collegeVerified.collegeName || collegeVerified.name} &mdash; {collegeVerified.district}
                  </div>
                )}
              </div>

              {role === 'student' && (
                <>
                  <div className="form-group">
                    <label className="form-label">PIN Number</label>
                    <input
                      className="form-input" placeholder="e.g. 24047-CS-023"
                      value={form.pinNumber}
                      onChange={e => setForm({ ...form, pinNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Branch</label>
                    <select
                      className="form-input"
                      value={form.branch}
                      onChange={e => setForm({ ...form, branch: e.target.value })}
                    >
                      <option value="">Select Branch</option>
                      {(collegeVerified?.branches || []).map(b => (
                        <option key={b.code} value={b.code}>{b.code} — {b.name || b.code}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Semester</label>
                    <select
                      className="form-input"
                      value={form.semester}
                      onChange={e => setForm({ ...form, semester: e.target.value })}
                    >
                      <option value="">Select Semester</option>
                      {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </>
              )}

              {(role === 'faculty' || role === 'hod') && (
                <>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input
                      className="form-input" placeholder="e.g. Computer Science"
                      value={form.department}
                      onChange={e => setForm({ ...form, department: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subjects (comma separated)</label>
                    <input
                      className="form-input" placeholder="e.g. DBMS, OS, Networks"
                      value={form.subjects}
                      onChange={e => setForm({ ...form, subjects: e.target.value })}
                    />
                  </div>
                </>
              )}

              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '13px' }}
                onClick={nextStep}
              >
                Next &rarr;
              </button>
            </div>
          )}

          {/* ── Step 1: Personal Info ── */}
          {step === 1 && (
            <div className="auth-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input" placeholder="Enter your full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input" type="email" placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  className="form-input" type="password" placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  className="form-input" type="password" placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-outline" style={{ flex: 1, padding: '13px' }} onClick={() => setStep(0)}>
                  &larr; Back
                </button>
                <button className="btn btn-primary" style={{ flex: 2, padding: '13px' }} onClick={nextStep}>
                  Next &rarr;
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Face Registration ── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Instruction bar */}
              <div style={{
                background: '#e3f0fb', border: '1px solid #1976d2',
                borderRadius: 4, padding: '10px 14px',
                fontSize: 13, color: '#1565c0', fontWeight: 600, lineHeight: 1.5,
              }}>
                Position your face inside the frame. The border turns
                <span style={{ color: '#f9a825', fontWeight: 800 }}> yellow</span> when detected,
                <span style={{ color: '#2e7d32', fontWeight: 800 }}> green</span> when registered successfully.
              </div>

              <FaceCamera mode="register" onCapture={handleFaceCapture} />

              <button
                className="btn btn-outline"
                style={{ width: '100%', padding: '11px' }}
                onClick={() => setStep(1)}
              >
                &larr; Back
              </button>
            </div>
          )}

          {/* ── Step 3: Done ── */}
          {step === 3 && (
            <div className="done-state">
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 36, height: 36, borderColor: 'rgba(0,51,102,0.2)', borderTopColor: '#003366' }} />
                  <p>Submitting your registration...</p>
                </>
              ) : (
                <>
                  <div className="done-icon">✓</div>
                  <h3>Registration Submitted</h3>
                  <p>
                    Your account is pending approval from your {role === 'student' ? 'HOD' : 'Admin'}.
                    You will receive access once your registration is approved.
                  </p>
                  <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '13px', marginTop: 8 }}>
                    Go to Login &rarr;
                  </Link>
                </>
              )}
            </div>
          )}

          {step < 2 && (
            <p className="auth-switch">Already registered? <Link to="/login">Login here</Link></p>
          )}
        </div>
      </div>
    </div>
  );
}