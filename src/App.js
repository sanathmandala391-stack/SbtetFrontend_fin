import React from 'react';
import { useState,useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Loader from './components/common/Loader';
// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAttendance from './pages/student/StudentAttendance';
import MarkAttendance from './pages/student/MarkAttendance';

// Faculty
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyStudents from './pages/faculty/FacultyStudents';
import FacultyReport from './pages/faculty/FacultyReport';

// HOD
import HodDashboard from './pages/hod/HodDashboard';
import HodToday from './pages/hod/HodToday';
import HodStudents from './pages/hod/HodStudents';
import HodApprovals from './pages/hod/HodApprovals';
import HodReport from './pages/hod/HodReport';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminColleges from './pages/admin/AdminColleges';
import AdminUsers from './pages/admin/AdminUsers';
import AdminApprovals from './pages/admin/AdminApprovals';
import RegisterCollege from './pages/admin/RegisterCollege';

import Navbar from './components/common/Navbar';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><div className="spinner"/></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><div className="spinner"/></div>;
  if (user) {
    const dashMap = { STUDENT: '/student', FACULTY: '/faculty', HOD: '/hod', ADMIN: '/admin' };
    return <Navigate to={dashMap[user.role] || '/'} replace />;
  }
  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Student */}
        <Route path="/student" element={<PrivateRoute roles={['STUDENT']}><StudentDashboard /></PrivateRoute>} />
        <Route path="/student/attendance" element={<PrivateRoute roles={['STUDENT']}><StudentAttendance /></PrivateRoute>} />
        <Route path="/student/mark" element={<PrivateRoute roles={['STUDENT']}><MarkAttendance /></PrivateRoute>} />

        {/* Faculty */}
        <Route path="/faculty" element={<PrivateRoute roles={['FACULTY','HOD']}><FacultyDashboard /></PrivateRoute>} />
        <Route path="/faculty/students" element={<PrivateRoute roles={['FACULTY','HOD']}><FacultyStudents /></PrivateRoute>} />
        <Route path="/faculty/report" element={<PrivateRoute roles={['FACULTY','HOD']}><FacultyReport /></PrivateRoute>} />

        {/* HOD */}
        <Route path="/hod" element={<PrivateRoute roles={['HOD']}><HodDashboard /></PrivateRoute>} />
        <Route path="/hod/today" element={<PrivateRoute roles={['HOD']}><HodToday /></PrivateRoute>} />
        <Route path="/hod/students" element={<PrivateRoute roles={['HOD']}><HodStudents /></PrivateRoute>} />
        <Route path="/hod/approvals" element={<PrivateRoute roles={['HOD']}><HodApprovals /></PrivateRoute>} />
        <Route path="/hod/report" element={<PrivateRoute roles={['HOD']}><HodReport /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<PrivateRoute roles={['ADMIN']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/colleges" element={<PrivateRoute roles={['ADMIN']}><AdminColleges /></PrivateRoute>} />
        <Route path="/admin/colleges/register" element={<PrivateRoute roles={['ADMIN']}><RegisterCollege /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute roles={['ADMIN']}><AdminUsers /></PrivateRoute>} />
        <Route path="/admin/approvals" element={<PrivateRoute roles={['ADMIN']}><AdminApprovals /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <AppRoutes />
//         <Toaster position="top-right" toastOptions={{ duration: 3500, style: { fontFamily: 'Open Sans, Arial, sans-serif', fontSize: 14 } }} />
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }


export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Force the loader to stay for 5 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer);
  }, []);
   if (loading) return <Loader />;
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { fontFamily: 'Open Sans, Arial, sans-serif', fontSize: 14 }
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}