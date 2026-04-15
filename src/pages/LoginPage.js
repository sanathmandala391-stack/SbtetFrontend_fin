import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './AuthPages.css';

export default function LoginPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome, ${user.name.split(' ')[0]}!`);
      const routes = { STUDENT: '/student', FACULTY: '/faculty', HOD: '/hod', ADMIN: '/admin' };
      navigate(routes[user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">TS</div>
          <h1>SBTET Telangana</h1>
          <p>State Board of Technical Education and Training, Government of Telangana</p>

          <div className="auth-features">
            <div className="auth-feat">
              Face Biometric Verification
            </div>
            <div className="auth-feat">
              GPS College Geofencing
            </div>
            <div className="auth-feat">
              Real-time Attendance Tracking
            </div>
            <div className="auth-feat">
              Secure Government Portal
            </div>
          </div>

          <div style={{
            marginTop: 8, padding: '12px 14px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 4,
            fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75,
          }}>
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Helpdesk:</strong><br />
            08031404549<br />
            sbtet-helpdesk@telangana.gov.in<br />
            Mon–Fri: 10:30 AM – 05:00 PM
          </div>
        </div>
      </div>

      {/* Right: login form */}
      <div className="auth-right">
        <div className="auth-box fade-in">
          {/* Header banner */}
          <div style={{
            background: '#003366', color: '#fff',
            padding: '14px 22px', borderRadius: '4px 4px 0 0',
            textAlign: 'center', marginBottom: 0,
          }}>
            <div style={{ fontSize: 10.5, letterSpacing: 1, opacity: 0.75, textTransform: 'uppercase', marginBottom: 3 }}>
              Government of Telangana
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', margin: 0 }}>Portal Login</h2>
          </div>

          <div style={{
            background: '#fff', border: '1px solid #d0d7e2',
            borderTop: 'none', borderRadius: '0 0 4px 4px',
            padding: '24px 22px 22px',
          }}>
            <p style={{ fontSize: 13, color: '#4a5568', marginBottom: 22, lineHeight: 1.6 }}>
              Enter your registered credentials to access the SBTET Attendance Portal.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="auth-form">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-input" type="email"
                    placeholder="your@email.com" required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    className="form-input" type="password"
                    placeholder="Enter your password" required
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: 14, justifyContent: 'center' }}
                  disabled={loading}
                >
                  {loading
                    ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Verifying…</>
                    : 'Login to Portal'
                  }
                </button>
              </div>
            </form>

            <div style={{
              marginTop: 14, padding: '10px 14px',
              background: '#e3f0fb', border: '1px solid #1976d2',
              borderRadius: 3, fontSize: 12.5, color: '#1565c0', lineHeight: 1.6,
            }}>
              Only registered students, faculty and HODs can login. Contact your HOD if your account is pending approval.
            </div>

            <p className="auth-switch" style={{ marginTop: 16 }}>
              New user? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
