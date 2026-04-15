// import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || '/api',
//   headers: { 'Content-Type': 'application/json' }
// });

// // Attach token
// api.interceptors.request.use(cfg => {
//   const token = localStorage.getItem('sbtet_token');
//   if (token) cfg.headers.Authorization = `Bearer ${token}`;
//   return cfg;
// });

// // Handle 401
// api.interceptors.response.use(
//   res => res,
//   err => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem('sbtet_token');
//       localStorage.removeItem('sbtet_user');
//       window.location.href = '/login';
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;

import axios from 'axios';

const api = axios.create({
  // This MUST match the /api prefix in your Java SecurityConfig
  baseURL: 'https://sbtet-backend-1.onrender.com/api', 
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to every request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('sbtet_token');
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// Auto-logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sbtet_token');
      localStorage.removeItem('sbtet_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;