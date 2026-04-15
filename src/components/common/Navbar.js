import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const NAV_LINKS = {
  STUDENT: [
    { to: '/student',            label: 'Dashboard' },
    { to: '/student/mark',       label: 'Mark Attendance' },
    { to: '/student/attendance', label: 'My Attendance' },
  ],
  FACULTY: [
    { to: '/faculty',          label: 'Dashboard' },
    { to: '/faculty/students', label: 'Students' },
    { to: '/faculty/report',   label: 'Reports' },
  ],
  HOD: [
    { to: '/hod',           label: 'Dashboard' },
    { to: '/hod/today',     label: "Today's Attendance" },
    { to: '/hod/students',  label: 'Students' },
    { to: '/hod/approvals', label: 'Approvals' },
    { to: '/hod/report',    label: 'Reports' },
  ],
  ADMIN: [
    { to: '/admin',                   label: 'Dashboard' },
    { to: '/admin/colleges',          label: 'Colleges' },
    { to: '/admin/users',             label: 'Users' },
    { to: '/admin/approvals',         label: 'Approvals' },
    { to: '/admin/colleges/register', label: 'Add College' },
  ],
};

const PUBLIC_NAV = [
  { to: '/',       label: 'Home' },
  { to: '/login',  label: 'Student Services' },
  { to: '/login',  label: 'College Services' },
  { to: '/login',  label: 'Others Services' },
  { to: '/login',  label: 'Affiliated Colleges' },
  { to: '/login',  label: 'Courses' },
  { to: '/login',  label: 'Contact Us' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };
  const links = user ? (NAV_LINKS[user.role] || []) : PUBLIC_NAV;

  return (
    <>
      {/*  UTILITY BAR  */}
      <div className="gov-topbar">
        <div className="gov-topbar-left">
          <span>Government of Telangana</span>
          <div className="topbar-divider" />
          <span>State Board of Technical Education and Training</span>
        </div>
        <div className="gov-topbar-right">
          <div className="font-ctrl">
            <button title="Decrease font size">A-</button>
            <button title="Default font size">A</button>
            <button title="Increase font size">A+</button>
          </div>
          <div className="topbar-divider" />
          <a href="tel:08031404549">08031404549</a>
          <div className="topbar-divider" />
          <a href="mailto:sbtet-helpdesk@telangana.gov.in">sbtet-helpdesk@telangana.gov.in</a>
        </div>
      </div>

      {/*  WHITE HEADER BAND  */}
      <div className="gov-header">
        {/* Left: Logo + Org Name */}
        <div className="gov-header-left">
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:13, textDecoration:'none' }}>
            <img
              src="/sb1.png" alt="SBTET Telangana"
              className="gov-logo"
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div className="gov-logo-fallback" style={{ display: 'none' }}>TS</div>
            <div className="gov-org-name">
              <span className="org-line">STATE BOARD OF TECHNICAL</span>
              <span className="org-line">EDUCATION AND TRAINING</span>
              <span className="org-line">TELANGANA</span>
            </div>
          </Link>
        </div>

        {/* Center: Rising badge + Officials */}
        <div className="gov-header-center">
          <div className="ts-badge">
            <div className="ts-name">TELANGANA</div>
            <div className="ts-rising">RISING</div>
            <div className="ts-tag">CURE - PURE - RARE</div>
          </div>
          <div className="officials">
            <div className="official">
              {/* <div className="official-avatar-fallback">S</div> */}
              <img 
  src="sb4.png" 
  alt="Sridevasena" 
  className="official-avatar"
/>
              <div className="official-name">Smt. A. Sridevasena, IAS</div>
              <div className="official-title">Chairperson</div>
            </div>
            <div className="official">
              {/* <div className="official-avatar-fallback">P</div> */}
                            <img 
  src="sb3.png" 
  alt="Sridevasena" 
  className="official-avatar"
/>
              <div className="official-name">Er A Pullaiah</div>
              <div className="official-title">Secretary</div>
            </div>
          </div>
        </div>

        {/* Right: Contact + Social */}
        <div className="gov-header-right">
          <div>
            <a href="mailto:sbtet-helpdesk@telangana.gov.in">sbtet-helpdesk@telangana.gov.in</a>
          </div>
          <div>
            <a href="tel:08031404549">08031404549</a>
            &nbsp;&nbsp;|&nbsp;&nbsp; All Working Days: 10:30AM – 05:00PM
          </div>
          <div className="social-row">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn fb">f</a>
            <a href="https://twitter.com"  target="_blank" rel="noreferrer" className="social-btn tw">t</a>
            <a href="https://youtube.com"  target="_blank" rel="noreferrer" className="social-btn yt">y</a>
          </div>
        </div>
      </div>

      {/*  BLUE STICKY NAV  */}
      <nav className="gov-navbar">
        <div className="gov-navbar-inner">
          <div className={`gov-nav-links ${menuOpen ? 'open' : ''}`} style={{ display:'flex', alignItems:'stretch', flex:1 }}>
            {links.map((l, i) => (
              <Link
                key={l.to + i} to={l.to}
                className={`gov-nav-link ${location.pathname === l.to ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="gov-nav-right">
            {user ? (
              <>
                <div className="gov-user-chip">
                  <div className="gov-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                  <div>
                    <div className="gov-uname">{user.name?.split(' ').slice(0,2).join(' ')}</div>
                    <div className="gov-urole">{user.role}</div>
                  </div>
                </div>
                <button className="gov-logout" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="gov-login-btn">Login</Link>
            )}
            <button className="gov-hamburger" onClick={() => setMenuOpen(m => !m)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
