import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './AdminPages.css';

const BRANCHES = [
  { code: 'AA', name: 'Architectural Assistantship' },
  { code: 'AI', name: 'Artificial Intelligence and Machine Learning' },
  { code: 'AU', name: 'Automobile Engineering' },
  { code: 'BM', name: 'Biomedical Engineering' },
  { code: 'CCB', name: 'Cloud Computing and Big Data' },
  { code: 'CCP', name: 'Commercial and Computer Practice' },
  { code: 'CE', name: 'Civil Engineering' },
  { code: 'CH', name: 'Chemical Engineering' },
  { code: 'CPS', name: 'Cyber Physical Systems and Security' },
  { code: 'CS', name: 'Computer Science and Engineering' },
  { code: 'EC', name: 'Electronics & Communication Engineering' },
  { code: 'EE', name: 'Electrical and Electronics Engineering' },
  { code: 'EEV', name: 'Electrical Engineering and Electric Vehicle Technology' },
  { code: 'EI', name: 'Electronics and Instrumentation Engineering' },
  { code: 'ES', name: 'Embedded Systems' },
  { code: 'EV', name: 'Electronics and Video Engineering' },
  { code: 'HS', name: 'Home Science' },
  { code: 'LF', name: 'Leather and Fashion Technology' },
  { code: 'LG', name: 'Leather Goods & Footwear Technology' },
  { code: 'ME', name: 'Mechanical Engineering' },
  { code: 'MN', name: 'Mining Engineering' },
  { code: 'MT', name: 'Metallurgical Engineering' },
  { code: 'PH', name: 'Pharmacy' },
  { code: 'PK', name: 'Packaging Technology' },
  { code: 'PT', name: 'Printing Technology' },
  { code: 'TT', name: 'Textile Technology' }
];

export default function RegisterCollege() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [form, setForm] = useState({
    name:'', collegeCode:'', address:'', district:'',
    principal:'', phone:'', email:'',
    latitude:'', longitude:'', radius:'200'
  });

  const f = (k, v) => setForm(p => ({...p, [k]:v}));

  const detectLocation = () => {
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        f('latitude', pos.coords.latitude.toFixed(6));
        f('longitude', pos.coords.longitude.toFixed(6));
        setDetectingLoc(false);
        toast.success('Location detected!');
      },
      () => { toast.error('Location access denied.'); setDetectingLoc(false); },
      { enableHighAccuracy: true }
    );
  };

  const toggleBranch = (code) => {
    setSelectedBranches(p => p.includes(code) ? p.filter(b=>b!==code) : [...p, code]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.latitude || !form.longitude) return toast.error('Please set the college location coordinates.');
    setLoading(true);
    try {
      await api.post('/admin/college', {
        name: form.name,
        collegeCode: form.collegeCode,
        address: form.address,
        district: form.district,
        principal: form.principal,
        phone: form.phone,
        email: form.email,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        radius: parseInt(form.radius),
        branches: selectedBranches.map(code => ({ code, name: BRANCHES.find(b=>b.code===code)?.name || code }))
      });
      toast.success('College registered successfully!');
      navigate('/admin/colleges');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register college.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page fade-in">
      <button className="btn btn-outline" style={{marginBottom:24}} onClick={() => navigate('/admin/colleges')}>← Back</button>
      <h1 style={{marginBottom:8}}>Register New College </h1>
      <p style={{color:'var(--gov-muted)',marginBottom:32}}>Add a polytechnic college to the SBTET attendance system.</p>

      <form onSubmit={handleSubmit}>
        <div className="card" style={{padding:32,marginBottom:20}}>
          <h3 style={{color:'var(--blue-dark)',marginBottom:20}}>Basic Information</h3>
          <div className="reg-form">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">College Name *</label>
                <input className="form-input" required placeholder="e.g. Government Polytechnic College" value={form.name} onChange={e=>f('name',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">College Code * (SBTET Code)</label>
                <input className="form-input" required placeholder="e.g. 047" value={form.collegeCode} onChange={e=>f('collegeCode',e.target.value)} />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">District *</label>
                <input className="form-input" required placeholder="e.g. Hyderabad" value={form.district} onChange={e=>f('district',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Principal Name</label>
                <input className="form-input" placeholder="Principal's name" value={form.principal} onChange={e=>f('principal',e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Full Address *</label>
              <textarea className="form-input" required rows={2} placeholder="Complete college address" value={form.address} onChange={e=>f('address',e.target.value)} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" placeholder="+91 XXXXXXXXXX" value={form.phone} onChange={e=>f('phone',e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="college@example.com" value={form.email} onChange={e=>f('email',e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{padding:32,marginBottom:20}}>
          <h3 style={{color:'var(--blue-dark)',marginBottom:8}}> GPS Location (for Geofencing)</h3>
          <p style={{fontSize:14,color:'var(--gov-muted)',marginBottom:20}}>Students can only mark attendance within {form.radius}m of this location.</p>
          <div className="map-hint"> Click "Detect My Location" while you are at the college, or enter coordinates manually from Google Maps.</div>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:16}}>
            <div className="form-group" style={{flex:1}}>
              <label className="form-label">Latitude *</label>
              <input className="form-input" required placeholder="e.g. 17.385044" value={form.latitude} onChange={e=>f('latitude',e.target.value)} />
            </div>
            <div className="form-group" style={{flex:1}}>
              <label className="form-label">Longitude *</label>
              <input className="form-input" required placeholder="e.g. 78.486671" value={form.longitude} onChange={e=>f('longitude',e.target.value)} />
            </div>
            <div className="form-group" style={{flex:1}}>
              <label className="form-label">Geofence Radius (meters)</label>
              <input className="form-input" type="number" min="50" max="1000" value={form.radius} onChange={e=>f('radius',e.target.value)} />
            </div>
          </div>
          <button type="button" className="btn btn-primary" style={{marginTop:12}} onClick={detectLocation} disabled={detectingLoc}>
            {detectingLoc ? ' Detecting...' : ' Detect My Location'}
          </button>
          {form.latitude && form.longitude && (
            <div style={{marginTop:12,fontSize:13,color:'#2e7d32',fontWeight:600}}> Location set: {form.latitude}, {form.longitude}</div>
          )}
        </div>

        <div className="card" style={{padding:32,marginBottom:28}}>
          <h3 style={{color:'var(--blue-dark)',marginBottom:16}}>Branches Offered</h3>
          <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
            {BRANCHES.map(b => (
              <button key={b.code} type="button"
                style={{padding:'8px 16px',borderRadius:8,fontSize:13,fontWeight:600,border:'2px solid',
                  borderColor: selectedBranches.includes(b.code) ? 'var(--blue-dark)' : 'var(--gov-border)',
                  background: selectedBranches.includes(b.code) ? 'var(--blue-dark)' : '#fff',
                  color: selectedBranches.includes(b.code) ? '#fff' : 'var(--gov-muted)',
                  cursor:'pointer',transition:'.2s'}}
                onClick={() => toggleBranch(b.code)}>
                {b.code} — {b.name}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-accent" style={{padding:'14px 36px',fontSize:16}} disabled={loading}>
          {loading ? 'Registering...' : ' Register College'}
        </button>
      </form>
    </div>
  );
}
